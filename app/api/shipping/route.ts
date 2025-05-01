import { db } from "@/lib/db/postgres/connection";
import { shippingMethods } from "@/lib/db/postgres/schema/shipping";

export async function GET() {
  try {
    const methods = await db.select().from(shippingMethods);
    return new Response(JSON.stringify(methods), { status: 200 });
  } catch (error) {
    console.error("Error fetching shipping methods:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch shipping methods" }),
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, estimatedDeliveryTime, isActive } = body;

    if (!name || !price || !estimatedDeliveryTime) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await db.insert(shippingMethods).values({
      name,
      price,
      estimatedDeliveryTime,
      isActive: isActive ?? true,
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error adding shipping method:", error);
    return new Response(
      JSON.stringify({ error: "Failed to add shipping method" }),
      { status: 500 }
    );
  }
}
