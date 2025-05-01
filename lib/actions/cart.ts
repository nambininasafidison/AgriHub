"use server";

import dbConnect from "@/lib/db/mongo/connection";
import CartModel from "@/lib/db/mongo/models/cart.model";
import { db } from "@/lib/db/postgres/connection";
import { promotions } from "@/lib/db/postgres/schema/promotions";
import { cartItemSchema, validateForm } from "@/lib/validationSchemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { CartItem } from "../types";
import { getSession } from "./auth";
import { getProductById } from "./products";

async function getCartId() {
  const session = await getSession();

  if (session?.id) {
    return { userId: session.id };
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart_id")?.value;

  if (cartId) {
    return { sessionId: cartId };
  }

  const newCartId = uuidv4();
  cookieStore.set("cart_id", newCartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { sessionId: newCartId };
}

export async function getCart() {
  try {
    await dbConnect();
    const { userId, sessionId } = await getCartId();

    let cart;

    if (userId) {
      cart = await CartModel.findOne({ userId });

      if (!cart) {
        const sessionCart = sessionId
          ? await CartModel.findOne({ sessionId })
          : null;

        if (sessionCart) {
          sessionCart.userId = userId;
          sessionCart.sessionId = undefined;
          await sessionCart.save();
          cart = sessionCart;

          const cookieStore = await cookies();
          cookieStore.delete("cart_id");
        } else {
          cart = await CartModel.create({
            userId,
            items: [],
            subtotal: 0,
            shippingCost: 0,
            taxAmount: 0,
            discountAmount: 0,
            total: 0,
            currency: "MGA",
          });
        }
      }
    } else if (sessionId) {
      cart = await CartModel.findOne({ sessionId });

      if (!cart) {
        cart = await CartModel.create({
          sessionId,
          items: [],
          subtotal: 0,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 0,
          currency: "MGA",
        });
      }
    } else {
      throw new Error("Failed to get or create cart");
    }

    return {
      id: cart._id.toString(),
      items: cart.items,
      subtotal: cart.subtotal,
      shippingCost: cart.shippingCost,
      taxAmount: cart.taxAmount,
      discountAmount: cart.discountAmount,
      total: cart.total,
      currency: cart.currency,
      appliedPromotions: cart.appliedPromotions || [],
    };
  } catch (error) {
    console.error("Error getting cart:", error);
    return {
      id: "error",
      items: [],
      subtotal: 0,
      shippingCost: 0,
      taxAmount: 0,
      discountAmount: 0,
      total: 0,
      currency: "MGA",
      appliedPromotions: [],
    };
  }
}

export async function addToCart(formData: FormData) {
  try {
    const data = validateForm(cartItemSchema, Object.fromEntries(formData));
    const { productId, quantity, variationId, variationName, variety } = data;

    const product = await getProductById(productId);

    if (!product) {
      return { error: "Product not found" };
    }

    if (product.stock < quantity) {
      return { error: "Not enough stock available" };
    }

    const { userId, sessionId } = await getCartId();

    let cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      cart = await CartModel.create({
        ...(userId ? { userId } : { sessionId }),
        items: [],
        subtotal: 0,
        shippingCost: 0,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
        currency: "MGA",
      });
    }

    const existingItemIndex: number = cart.items.findIndex(
      (item: CartItem) =>
        item.productId === productId && item.variationId === variationId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].subtotal =
        cart.items[existingItemIndex].price *
        cart.items[existingItemIndex].quantity;
    } else {
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        variationId,
        variationName,
        variety,
        weight: product.weight,
        subtotal: product.price * quantity,
      });
    }

    cart.subtotal = cart.items.reduce(
      (sum: number, item: CartItem) =>
        sum + (item.subtotal || item.price * item.quantity),
      0
    );
    cart.total =
      cart.subtotal + cart.shippingCost + cart.taxAmount - cart.discountAmount;

    await cart.save();

    return { success: true, cart };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { error: "Failed to add item to cart" };
  }
}

export async function updateCartItem(formData: FormData) {
  try {
    const data = validateForm(cartItemSchema, Object.fromEntries(formData));
    const { productId, quantity, variationId } = data;

    await dbConnect();

    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    const itemIndex = cart.items.findIndex(
      (item: { productId: string; variationId?: string }) =>
        item.productId === productId && item.variationId === variationId
    );

    if (itemIndex === -1) {
      return { error: "Item not found in cart" };
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
    }

    cart.subtotal = cart.items.reduce(
      (
        sum: number,
        item: { subtotal?: number; price: number; quantity: number }
      ) => sum + (item.subtotal || item.price * item.quantity),
      0
    );
    cart.total =
      cart.subtotal + cart.shippingCost + cart.taxAmount - cart.discountAmount;

    await cart.save();

    return { success: true, cart };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { error: "Failed to update cart item" };
  }
}

export async function removeFromCart(formData: FormData) {
  try {
    const data = validateForm(cartItemSchema, Object.fromEntries(formData));
    const { productId, variationId } = data;

    await dbConnect();

    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    const itemIndex = cart.items.findIndex(
      (item: { productId: string; variationId?: string }) =>
        item.productId === productId && item.variationId === variationId
    );

    if (itemIndex === -1) {
      return { error: "Item not found in cart" };
    }

    cart.items.splice(itemIndex, 1);

    cart.subtotal = cart.items.reduce(
      (
        sum: number,
        item: { subtotal?: number; price: number; quantity: number }
      ) => sum + (item.subtotal || item.price * item.quantity),
      0
    );
    cart.total =
      cart.subtotal + cart.shippingCost + cart.taxAmount - cart.discountAmount;

    await cart.save();

    return { success: true, cart };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { error: "Failed to remove item from cart" };
  }
}

export async function clearCart() {
  try {
    await dbConnect();
    const { userId, sessionId } = await getCartId();

    if (userId) {
      await CartModel.findOneAndUpdate(
        { userId },
        {
          items: [],
          subtotal: 0,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 0,
          appliedPromotions: [],
        }
      );
    } else if (sessionId) {
      await CartModel.findOneAndUpdate(
        { sessionId },
        {
          items: [],
          subtotal: 0,
          shippingCost: 0,
          taxAmount: 0,
          discountAmount: 0,
          total: 0,
          appliedPromotions: [],
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { error: "Failed to clear cart" };
  }
}

export async function applyPromotion(formData: FormData) {
  try {
    const code = formData.get("code") as string;

    if (!code) {
      return { error: "Promotion code is required" };
    }

    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    const [promotion] = await db
      .select()
      .from(promotions)
      .where(eq(promotions.code, code));

    if (!promotion) {
      return { error: "Invalid promotion code" };
    }

    const discountAmount =
      promotion.type === "percentage"
        ? Math.round(
            (Number(cart.subtotal) || 0) * (Number(promotion.value) / 100)
          )
        : Number(promotion.value);

    cart.discountAmount = discountAmount;
    cart.total =
      cart.subtotal + cart?.shippingCost + cart.taxAmount - cart.discountAmount;

    cart.appliedPromotions = [
      {
        id: promotion.id,
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
        discountAmount,
      },
    ];

    await cart.save();

    return {
      success: true,
      message: "Promotion code applied successfully",
      discountAmount,
      cart,
    };
  } catch (error) {
    console.error("Error applying promotion:", error);
    return { error: "Failed to apply promotion code" };
  }
}

export async function removePromotion() {
  try {
    await dbConnect();
    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    cart.discountAmount = 0;
    cart.appliedPromotions = [];
    cart.total = cart.subtotal + cart.shippingCost + cart.taxAmount;

    await cart.save();

    return { success: true, cart };
  } catch (error) {
    console.error("Error removing promotion:", error);
    return { error: "Failed to remove promotion code" };
  }
}

export async function calculateShipping(formData: FormData) {
  try {
    await dbConnect();
    const region = formData.get("region") as string;

    if (!region) {
      return { error: "Region is required" };
    }

    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    const totalWeight: number = cart.items.reduce(
      (sum: number, item: { weight?: number; quantity: number }) => {
        return sum + (item.weight || 0) * item.quantity;
      },
      0
    );

    let shippingCost = 5000;

    shippingCost += Math.round(totalWeight * 10000);

    if (region === "Analamanga") {
      shippingCost = 5000;
    } else if (["Diana", "Sava", "Atsimo-Atsinanana"].includes(region)) {
      shippingCost += 10000;
    }

    if (cart.subtotal >= 500000) {
      shippingCost = 0;
    }

    cart.shippingCost = shippingCost;
    cart.total =
      cart.subtotal + cart.shippingCost + cart.taxAmount - cart.discountAmount;

    await cart.save();

    return {
      success: true,
      shippingCost,
      cart,
    };
  } catch (error) {
    console.error("Error calculating shipping:", error);
    return { error: "Failed to calculate shipping cost" };
  }
}

export async function calculateTax() {
  try {
    await dbConnect();
    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { error: "Cart not found" };
    }

    const taxRate = 0.2;
    const taxAmount = Math.round(cart.subtotal * taxRate);

    cart.taxAmount = taxAmount;
    cart.total =
      cart.subtotal + cart.shippingCost + cart.taxAmount - cart.discountAmount;

    await cart.save();

    return {
      success: true,
      taxAmount,
      cart,
    };
  } catch (error) {
    console.error("Error calculating tax:", error);
    return { error: "Failed to calculate tax" };
  }
}

export async function updateShippingAddress(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await dbConnect();
    const { userId, sessionId } = await getCartId();

    const cart = userId
      ? await CartModel.findOne({ userId })
      : await CartModel.findOne({ sessionId });

    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    cart.shippingAddress = {
      region: formData.get("region") as string,
      city: formData.get("city") as string,
    };

    await cart.save();

    return { success: true };
  } catch (error) {
    console.error("Error updating shipping address:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
