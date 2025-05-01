import { getSession } from "@/lib/actions/auth";
import { connectToDatabases } from "@/lib/db";
import Cart from "@/lib/db/mongo/models/cart.model";
import Product from "@/lib/db/mongo/models/product.model";
import { db } from "@/lib/db/postgres/connection";
import { orderItems, orders } from "@/lib/db/postgres/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const offset = (page - 1) * limit;

    const { postgres } = await connectToDatabases();
    if (!postgres) {
      console.error("Failed to connect to PostgreSQL");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const query = status
      ? db
          .select()
          .from(orders)
          .where(and(eq(orders.userId, session.id), eq(orders.status, status)))
      : db.select().from(orders).where(eq(orders.userId, session.id));

    const userOrders = await query
      .limit(limit)
      .offset(offset)
      .orderBy(orders.createdAt);

    const orderIds = userOrders.map((order) => order.id);

    const allOrderItems = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));

    const orderItemsByOrderId = allOrderItems.reduce((acc, item) => {
      if (!acc[item.orderId]) {
        acc[item.orderId] = [];
      }
      acc[item.orderId].push(item);
      return acc;
    }, {} as Record<number, typeof allOrderItems>);

    const ordersWithItems = userOrders.map((order) => ({
      ...order,
      items: orderItemsByOrderId[order.id] || [],
    }));

    const countResult = await db
      .select({ count: sql`COUNT(*)` })
      .from(orders)
      .where(eq(orders.userId, session.id));

    const total = Number(countResult[0].count);

    return NextResponse.json({
      orders: ordersWithItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddress, paymentMethod } = await request.json();

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { error: "Shipping address and payment method are required" },
        { status: 400 }
      );
    }

    const { mongo, postgres } = await connectToDatabases();
    if (!mongo || !postgres) {
      console.error("Failed to connect to databases");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const cart = await Cart.findOne({ userId: session.id }).lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = (
      (await Product.find({
        _id: { $in: productIds },
      }).lean()) as unknown as Array<{
        _id: unknown;
        name: string;
        stock: number;
        price: number;
        salePrice?: number;
      }>
    ).map((product) => ({
      _id: String(product._id),
      name: product.name,
      stock: product.stock,
      price: product.price,
      salePrice: product.salePrice,
    }));

    for (const item of cart.items) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Not enough stock for product ${product.name}` },
          { status: 400 }
        );
      }

      item.price = product.salePrice || product.price;
      item.subtotal = item.price * item.quantity;
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.subtotal || 0),
      0
    );
    const shippingCost = 10;
    const taxAmount = subtotal * 0.2;
    const discountAmount = (cart as any).discount || 0;
    const total = subtotal + taxAmount + shippingCost - discountAmount;

    const orderUuid = uuidv4();
    const orderNumber = `ORD-${Date.now()}`;

    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: session.id.toString(),
        uuid: orderUuid,
        orderNumber: orderNumber,
        customer: session.name,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        total,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        shippingAddress: JSON.stringify(shippingAddress),
        currency: "MGA",
        appliedPromotions: (cart as any).couponCode
          ? [(cart as any).couponCode]
          : [],
      })
      .returning();

    for (const item of cart.items) {
      await db.insert(orderItems).values({
        productId: parseInt(item.productId, 10),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variety: item.variety,
        variationId: item.variationId?.toString(),
        variationName: item.variationName,
        weight: 0,
        subtotal: item.subtotal || item.price * item.quantity,
      });

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    await Cart.findOneAndUpdate(
      { userId: session.id },
      { $set: { items: [] } }
    );

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder.uuid,
        orderNumber: newOrder.orderNumber,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
