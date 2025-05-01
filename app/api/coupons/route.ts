import { db } from "@/lib/db/postgres/connection";
import { coupons } from "@/lib/db/postgres/schema/coupons";

export async function GET() {
  try {
    const allCoupons = await db.select().from(coupons);
    return new Response(JSON.stringify(allCoupons), { status: 200 });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch coupons" }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      code,
      type,
      value,
      startDate,
      endDate,
      minPurchase,
      maxDiscount,
      usageLimit,
    } = body;

    if (!code || !type || !value || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    await db.insert(coupons).values({
      code,
      type,
      value,
      startDate,
      endDate,
      minPurchase,
      maxDiscount,
      usageLimit,
    });

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("Error adding coupon:", error);
    return new Response(JSON.stringify({ error: "Failed to add coupon" }), {
      status: 500,
    });
  }
}
