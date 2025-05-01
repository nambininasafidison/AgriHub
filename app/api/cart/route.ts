import { getSession } from "@/lib/actions/auth";
import { connectToDatabases } from "@/lib/db";
import Cart, { ICart } from "@/lib/db/mongo/models/cart.model";
import Product from "@/lib/db/mongo/models/product.model";
import { FlattenMaps } from "mongoose";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    let cart = await Cart.findOne({ userId: session.id }).lean();

    if (!cart) {
      cart = new Cart({
        userId: session.id,
        items: [],
        subtotal: 0,
        total: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        currency: "USD",
        sessionId: session.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).toObject() as FlattenMaps<ICart> &
        Required<{ _id: FlattenMaps<unknown> }> & { __v: number };
    }

    if (cart.items && cart.items.length > 0) {
      const productIds = cart.items.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } }).lean();

      cart.items = cart.items.map((item) => {
        const product = products.find(
          (p) => p._id.toString() === item.productId.toString()
        );

        if (product) {
          return {
            ...item,
            name: product.name,
            price: product.salePrice || product.price,
            image: product.image,
            subtotal: (product.salePrice || product.price) * item.quantity,
          };
        }

        return item;
      });

      cart.subtotal = cart.items.reduce(
        (sum, item) => sum + (item.subtotal || 0),
        0
      );
      cart.tax = cart.subtotal * 0.2;
      cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
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

    const { productId, quantity, variationId } = await request.json();

    if (!productId || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const product = await Product.findById(productId).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ userId: session.id });

    if (!cart) {
      cart = new Cart({
        userId: session.id,
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (variationId
          ? item.variationId?.toString() === variationId
          : !item.variationId)
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: uuidv4(),
        productId,
        variationId,
        quantity,
        price: product.salePrice || product.price,
        name: product.name,
        image: product.image,
        weight: product.weight || 0,
        subtotal: (product.salePrice || product.price) * quantity,
      });
    }

    cart.subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    cart.tax = cart.subtotal * 0.2;
    cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, couponCode } = await request.json();

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const cart = await Cart.findOne({ userId: session.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (items && Array.isArray(items)) {
      for (const item of items) {
        if (!item.productId || item.quantity <= 0) {
          return NextResponse.json(
            { error: "Invalid item data" },
            { status: 400 }
          );
        }

        const product = await Product.findById(item.productId).lean();

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
      }

      cart.items = items.map((item) => ({
        id: uuidv4(),
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        weight: item.weight || 0,
        subtotal: (item.price || 0) * item.quantity,
      }));
    }

    if (couponCode) {
      cart.couponCode = couponCode;
    }

    cart.subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    cart.tax = cart.subtotal * 0.2;
    cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;

    await cart.save();

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    const { mongo } = await connectToDatabases();
    if (!mongo) {
      console.error("Failed to connect to MongoDB");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const cart = await Cart.findOne({ userId: session.id });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (itemId) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== itemId
      );
    } else {
      cart.items = [];
    }

    cart.subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = item.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    cart.tax = cart.subtotal * 0.2;
    cart.total = cart.subtotal + cart.tax + cart.shipping - cart.discount;

    await cart.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
