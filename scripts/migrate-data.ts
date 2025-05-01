import { connectToDatabases } from "@/lib/db";
import Order from "@/lib/db/mongo/models/order.model";
import Product from "@/lib/db/mongo/models/product.model";
import User from "@/lib/db/mongo/models/user.model";
import { db as postgresDb } from "@/lib/db/postgres/connection";
import {
  addresses,
  orderItems,
  orders,
  products,
  users,
} from "@/lib/db/postgres/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function migrateUsers() {
  console.log("Migrating users...");

  const { mongo } = await connectToDatabases();
  if (!mongo) {
    console.error("Failed to connect to MongoDB");
    return;
  }

  const mongoUsers = await User.find().lean();

  for (const mongoUser of mongoUsers) {
    const existingUser = await postgresDb.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, mongoUser.email),
    });

    if (existingUser) {
      console.log(
        `User ${mongoUser.email} already exists in PostgreSQL, skipping...`
      );
      continue;
    }

    const uuid = uuidv4();
    let passwordHash = mongoUser.password;

    try {
      if (!passwordHash.startsWith("$2a$")) {
        const salt = await bcrypt.genSalt(10);
        passwordHash = await bcrypt.hash(mongoUser.password, salt);
      }
    } catch (err) {
      console.error(`Error hashing password for user ${mongoUser.email}:`, err);
      continue;
    }

    await postgresDb.insert(users).values({
      uuid,
      name: mongoUser.name,
      email: mongoUser.email,
      passwordHash: passwordHash,
      role: mongoUser.role,
      region: mongoUser.region,
      specialty: mongoUser.specialty,
      phone: mongoUser.phone,
      avatar: mongoUser.avatar,
      isVerified: mongoUser.isVerified,
      preferences: mongoUser.preferences,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt,
    });

    if (mongoUser.addresses && mongoUser.addresses.length > 0) {
      for (const mongoAddress of mongoUser.addresses) {
        await postgresDb.insert(addresses).values({
          uuid: uuidv4(),
          userId: uuid,
          name: mongoAddress.name,
          phone: mongoAddress.phone,
          address: mongoAddress.address,
          city: mongoAddress.city,
          region: mongoAddress.region,
          postalCode: mongoAddress.postalCode,
          country: mongoAddress.country,
          isDefault: mongoAddress.isDefault,
          type: mongoAddress.type,
        });
      }
    }

    console.log(`Migrated user ${mongoUser.email}`);
  }

  console.log("User migration completed");
}

async function migrateProducts() {
  console.log("Migrating products...");

  const { mongo } = await connectToDatabases();
  if (!mongo) {
    console.error("Failed to connect to MongoDB");
    return;
  }

  const mongoProducts = await Product.find().lean();

  for (const mongoProduct of mongoProducts) {
    const existingProduct = await postgresDb.query.products.findFirst({
      where: (products, { eq }) => eq(products.uuid, mongoProduct.id),
    });

    if (existingProduct) {
      console.log(
        `Product ${mongoProduct.name} already exists in PostgreSQL, skipping...`
      );
      continue;
    }

    const productUuid = uuidv4();

    await postgresDb.insert(products).values({
      uuid: productUuid,
      name: mongoProduct.name,
      description: mongoProduct.description,
      price: mongoProduct.price,
      salePrice: mongoProduct.salePrice,
      category: mongoProduct.category,
      subcategory: mongoProduct.subcategory,
      region: mongoProduct.region,
      seller: mongoProduct.seller,
      sellerId: mongoProduct.sellerId,
      stock: mongoProduct.stock,
      rating: mongoProduct.rating,
      reviewCount: mongoProduct.reviewCount,
      image: mongoProduct.image,
      images: mongoProduct.images,
      varieties: mongoProduct.varieties,
      attributes: mongoProduct.attributes,
      weight: mongoProduct.weight,
      dimensions: mongoProduct.dimensions,
      sku: mongoProduct.sku,
      barcode: mongoProduct.barcode,
      isActive: mongoProduct.isActive,
      isFeatured: mongoProduct.isFeatured,
      isNew: mongoProduct.isNew,
      onSale: mongoProduct.onSale,
      tags: mongoProduct.tags,
      createdAt: mongoProduct.createdAt,
      updatedAt: mongoProduct.updatedAt,
    });

    console.log(`Migrated product ${mongoProduct.name}`);
  }

  console.log("Product migration completed");
}

async function migrateOrders() {
  console.log("Migrating orders...");

  const { mongo } = await connectToDatabases();
  if (!mongo) {
    console.error("Failed to connect to MongoDB");
    return;
  }

  const mongoOrders = await Order.find().lean();

  for (const mongoOrder of mongoOrders) {
    const existingOrder = await postgresDb.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.uuid, mongoOrder.id),
    });

    if (existingOrder) {
      console.log(
        `Order ${mongoOrder.id} already exists in PostgreSQL, skipping...`
      );
      continue;
    }

    const orderUuid = uuidv4();

    const [newOrder] = await postgresDb
      .insert(orders)
      .values({
        uuid: orderUuid,
        orderNumber: mongoOrder.orderNumber || `ORD-${Date.now()}`,
        userId: mongoOrder.userId,
        customer: mongoOrder.customer,
        subtotal: mongoOrder.subtotal,
        shippingCost: mongoOrder.shippingCost,
        taxAmount: mongoOrder.taxAmount,
        discountAmount: mongoOrder.discountAmount,
        total: mongoOrder.total,
        status: mongoOrder.status,
        paymentStatus: mongoOrder.paymentStatus,
        paymentMethod: mongoOrder.paymentMethod,
        shippingAddress: mongoOrder.shippingAddress,
        trackingNumber: mongoOrder.trackingNumber,
        carrier: mongoOrder.carrier,
        appliedPromotions: mongoOrder.appliedPromotions,
        currency: mongoOrder.currency,
        notes: mongoOrder.notes,
        createdAt: mongoOrder.createdAt,
        updatedAt: mongoOrder.updatedAt,
      })
      .returning();

    if (mongoOrder.items && mongoOrder.items.length > 0) {
      for (const mongoItem of mongoOrder.items) {
        const product = await postgresDb.query.products.findFirst({
          where: (products, { eq }) => eq(products.uuid, mongoItem.productId),
        });

        if (!product) {
          console.log(
            `Product ${mongoItem.productId} not found, skipping order item...`
          );
          continue;
        }

        await postgresDb.insert(orderItems).values({
          orderId: newOrder.uuid,
          productId: product.id,
          productUuid: mongoItem.productId,
          name: mongoItem.name,
          price: mongoItem.price,
          quantity: mongoItem.quantity,
          image: mongoItem.image,
          variety: mongoItem.variety,
          variationId: mongoItem.variationId,
          variationName: mongoItem.variationName,
          weight: mongoItem.weight || 0,
          subtotal: mongoItem.subtotal,
        });
      }
    }

    console.log(`Migrated order ${mongoOrder.id}`);
  }

  console.log("Order migration completed");
}

async function main() {
  try {
    console.log("Starting data migration...");

    await migrateUsers();
    await migrateProducts();
    await migrateOrders();

    console.log("Data migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
