import { connectToDatabases } from "@/lib/db";
import Product from "@/lib/db/mongo/models/product.model";
import { db } from "@/lib/db/postgres/connection";
import { addresses, promotions, users } from "@/lib/db/postgres/schema";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

async function initPostgres() {
  console.log("Initializing PostgreSQL database...");

  const { postgres } = await connectToDatabases();
  if (!postgres) {
    console.error("Failed to connect to PostgreSQL");
    return;
  }

  try {
    const existingUsers = await db.select().from(users).limit(1);

    if (existingUsers.length === 0) {
      console.log("Creating admin user...");

      const adminUuid = uuidv4();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("admin123", salt);

      await db.insert(users).values({
        uuid: adminUuid,
        name: "Admin User",
        email: "admin@agricommercehub.com",
        passwordHash,
        role: "admin",
        isVerified: true,
        preferences: {
          language: "en",
          currency: "MGA",
          newsletter: false,
        },
      });

      console.log("Admin user created successfully");

      const userUuid = uuidv4();
      const userPasswordHash = await bcrypt.hash("user123", salt);

      await db.insert(users).values({
        uuid: userUuid,
        name: "Test User",
        email: "user@agricommercehub.com",
        passwordHash: userPasswordHash,
        role: "buyer",
        isVerified: true,
        preferences: {
          language: "en",
          currency: "MGA",
          newsletter: true,
        },
      });

      console.log("Test user created successfully");

      await db.insert(addresses).values({
        uuid: uuidv4(),
        userId: userUuid,
        name: "Test User",
        phone: "0341234567",
        address: "123 Test Street",
        city: "Antananarivo",
        region: "Analamanga",
        postalCode: "101",
        country: "Madagascar",
        isDefault: true,
        type: "both",
      });

      console.log("Test address created successfully");

      await db.insert(promotions).values({
        id: uuidv4(),
        uuid: uuidv4(),
        userId: adminUuid,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "Welcome Discount",
        description: "10% off your first order",
        type: "percentage_discount",
        value: 10,
        code: "WELCOME10",
        minOrderAmount: 50000,
        maxDiscountAmount: 10000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      });

      console.log("Test promotion created successfully");
    } else {
      console.log("PostgreSQL database already initialized");
    }
  } catch (error) {
    console.error("Error initializing PostgreSQL database:", error);
    throw error;
  }
}

async function initMongo() {
  console.log("Initializing MongoDB database...");

  const { mongo } = await connectToDatabases();
  if (!mongo) {
    console.error("Failed to connect to MongoDB");
    return;
  }

  try {
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      console.log("Creating test products...");

      const products = [
        {
          name: "Organic Rice",
          description: "Premium organic rice grown in Madagascar",
          price: 15000,
          salePrice: 13500,
          category: "Grains",
          subcategory: "Rice",
          region: "Alaotra-Mangoro",
          seller: "Local Farmer Cooperative",
          sellerId: "user-uuid-1",
          stock: 100,
          rating: 4.5,
          reviewCount: 12,
          image: "/placeholder.svg?height=300&width=300",
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
          varieties: ["White", "Red", "Black"],
          attributes: {
            origin: "Madagascar",
          },
        },
      ];

      await Product.insertMany(products);

      console.log("Test products created successfully");
    } else {
      console.log("MongoDB database already initialized");
    }
  } catch (error) {
    console.error("Error initializing MongoDB database:", error);
    throw error;
  }
}

async function main() {
  try {
    await initPostgres();
    await initMongo();

    console.log("Database initialization completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

main();
