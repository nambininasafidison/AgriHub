import { connectToDatabases } from "@/lib/db";
import Product from "@/lib/db/mongo/models/product.model";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(`Error updating product ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting product ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
