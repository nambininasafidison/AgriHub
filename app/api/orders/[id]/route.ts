import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db/postgres/connection"
import { orders, orderItems } from "@/lib/db/postgres/schema"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if id is a UUID or a numeric ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    const order = await db
      .select()
      .from(orders)
      .where(isUuid ? eq(orders.uuid, id) : eq(orders.id, Number.parseInt(id)))
      .limit(1)

    if (!order || order.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get order items
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order[0].id))

    return NextResponse.json({
      ...order[0],
      items,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    // Check if order exists
    const existingOrder = await db.select().from(orders).where(eq(orders.uuid, id)).limit(1)

    if (!existingOrder || existingOrder.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order
    const updatedOrder = await db
      .update(orders)
      .set({
        status: body.status,
        paymentStatus: body.paymentStatus,
        trackingNumber: body.trackingNumber,
        carrier: body.carrier,
        notes: body.notes,
        updatedAt: new Date(),
      })
      .where(eq(orders.uuid, id))
      .returning()

    return NextResponse.json(updatedOrder[0])
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
