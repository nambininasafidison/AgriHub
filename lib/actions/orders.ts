"use server";

import {
  orderSchema,
  paymentStatusSchema,
  trackingInfoSchema,
  validateForm,
} from "@/lib/validationSchemas";
import { cookies } from "next/headers";
import { connectToDatabases } from "../db";
import Order from "../db/mongo/models/order.model";
import type { OrderStatus } from "../types";
import {
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
} from "../utils/email";
import { getSession } from "./auth";
import { clearCart, getCart } from "./cart";

export async function getOrders(options?: {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const session = await getSession();

  if (!session) {
    return [];
  }

  await connectToDatabases();
  const query: any = { userId: session.id };

  if (options?.status) {
    query.status = options.status;
  }

  if (options?.startDate) {
    query.createdAt = { $gte: new Date(options.startDate) };
  }

  if (options?.endDate) {
    query.createdAt = { ...query.createdAt, $lte: new Date(options.endDate) };
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip((options?.page || 0) * (options?.limit || 10))
    .limit(options?.limit || 10);

  return orders;
}

export async function getOrderById(id: string) {
  const session = await getSession();

  if (!session) {
    return null;
  }

  await connectToDatabases();
  const order = await Order.findById(id);

  if (!order || (order.userId !== session.id && session.role !== "admin")) {
    return null;
  }

  return order;
}

export async function createOrder(formData: FormData) {
  try {
    const data = validateForm(orderSchema, Object.fromEntries(formData));
    const { name, address, city, phone, paymentMethod } = data;

    const session = await getSession();

    if (!session) {
      return { error: "Vous devez être connecté pour passer une commande" };
    }

    const cart = await getCart();

    if (cart.items.length === 0) {
      return { error: "Votre panier est vide" };
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      variety: item.variety,
      variationId: item.variationId,
      variationName: item.variationName,
      weight: item.weight,
      subtotal: item.subtotal,
    }));

    const newOrder = new Order({
      userId: session.id,
      customer: name,
      date: new Date().toLocaleDateString("fr-FR"),
      items: orderItems,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost || 0,
      taxAmount: cart.taxAmount || 0,
      discountAmount: cart.discountAmount || 0,
      total: cart.total || cart.subtotal,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod,
      shippingAddress: `${address}, ${city}`,
      appliedPromotions: cart.appliedPromotions,
      currency: cart.currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await connectToDatabases();
    await newOrder.save();

    await clearCart();

    const cookieStore = await cookies();
    cookieStore.set("lastOrder", newOrder.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
    });

    await sendOrderConfirmationEmail(session.email, newOrder);

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "An error occurred while creating the order" };
  }
}

export async function getLastOrderId(): Promise<string | null> {
  const cookieStore = await cookies();
  const lastOrder = cookieStore.get("lastOrder")?.value;
  return lastOrder || null;
}

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId || !status) {
    return { error: "Informations invalides" };
  }

  await connectToDatabases();
  const order = await Order.findById(orderId);

  if (!order) {
    return { error: "Commande non trouvée" };
  }

  const oldStatus = order.status;
  if (
    status === "pending" ||
    status === "confirmed" ||
    status === "shipped" ||
    status === "delivered" ||
    status === "cancelled"
  ) {
    order.status = status;
  } else {
    return { error: "Statut invalide" };
  }
  order.updatedAt = new Date();

  if (status === "delivered" && order.paymentStatus !== "paid") {
    order.paymentStatus = "paid";
  }

  await order.save();

  if (oldStatus !== status) {
    const customerEmail = order.customerEmail;
    await sendOrderStatusUpdateEmail(customerEmail, order);
  }

  return { success: true };
}

export async function updatePaymentStatus(formData: FormData) {
  try {
    const data = validateForm(
      paymentStatusSchema,
      Object.fromEntries(formData)
    );
    const { orderId, paymentStatus } = data;

    const session = await getSession();

    if (
      !session ||
      (session.role !== "admin" &&
        session.role !== "farmer" &&
        session.role !== "supplier")
    ) {
      return { error: "Vous n'avez pas les permissions nécessaires" };
    }

    await connectToDatabases();
    const order = await Order.findById(orderId);

    if (!order) {
      return { error: "Commande non trouvée" };
    }

    order.paymentStatus = paymentStatus;
    order.updatedAt = new Date();

    if (paymentStatus === "paid" && order.status === "pending") {
      order.status = "confirmed";
    }

    await order.save();

    return { success: true };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { error: "An error occurred while updating payment status" };
  }
}

export async function addTrackingInfo(formData: FormData) {
  try {
    const data = validateForm(trackingInfoSchema, Object.fromEntries(formData));
    const { orderId, trackingNumber } = data;

    await connectToDatabases();
    const order = await Order.findById(orderId);
    if (!order) {
      return { error: "Commande non trouvée" };
    }

    order.trackingNumber = trackingNumber;
    if (order.status === "confirmed") {
      order.status = "shipped";
    }

    await order.save();

    const customerEmail = order.customerEmail;
    await sendOrderStatusUpdateEmail(customerEmail, order);

    return { success: true };
  } catch (error) {
    console.error("Error adding tracking info:", error);
    return { error: "An error occurred while adding tracking info" };
  }
}

export async function cancelOrder(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const reason = formData.get("reason") as string;

  if (!orderId) {
    return { error: "ID de commande requis" };
  }

  const session = await getSession();

  if (!session) {
    return { error: "Vous devez être connecté" };
  }

  await connectToDatabases();
  const order = await Order.findById(orderId);

  if (!order) {
    return { error: "Commande non trouvée" };
  }

  if (order.userId !== session.id && session.role !== "admin") {
    return { error: "Vous n'êtes pas autorisé à annuler cette commande" };
  }

  if (order.status !== "pending" && order.status !== "confirmed") {
    return { error: "Cette commande ne peut plus être annulée" };
  }

  order.status = "cancelled";
  order.notes = reason ? `Annulée: ${reason}` : "Annulée par le client";
  order.updatedAt = new Date();

  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  } else {
    order.paymentStatus = "cancelled";
  }

  const customerEmail = order.customerEmail;
  await sendOrderStatusUpdateEmail(customerEmail, order);

  return { success: true };
}

export async function getOrderStatistics() {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "admin" &&
      session.role !== "farmer" &&
      session.role !== "supplier")
  ) {
    return { error: "Vous n'avez pas les permissions nécessaires" };
  }

  await connectToDatabases();

  let relevantOrders = await Order.find();

  if (session.role === "farmer" || session.role === "supplier") {
    relevantOrders = relevantOrders.filter((order) =>
      order.items.some((item) => item.sellerId === session.id)
    );
  }

  const totalOrders = relevantOrders.length;
  const totalRevenue = relevantOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const ordersByStatus = {
    pending: relevantOrders.filter((order) => order.status === "pending")
      .length,
    confirmed: relevantOrders.filter((order) => order.status === "confirmed")
      .length,
    shipped: relevantOrders.filter((order) => order.status === "shipped")
      .length,
    delivered: relevantOrders.filter((order) => order.status === "delivered")
      .length,
    cancelled: relevantOrders.filter((order) => order.status === "cancelled")
      .length,
  };

  const recentOrders = relevantOrders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    ordersByStatus,
    recentOrders,
  };
}
