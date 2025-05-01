import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { connectToDatabases } from "./index";
import {
  addresses,
  orderItems,
  orders,
  products,
  promotions,
  users,
} from "./postgres/schema";
import { db } from "./postgres/connection";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    const existingUsers = await db.select().from(users).limit(1);

    if (existingUsers && existingUsers.length > 0) {
      console.log("Database already seeded");
      return;
    }

    const passwordHash = await bcrypt.hash("password123", 10);

    const user1Uuid = uuidv4();
    const user2Uuid = uuidv4();
    const user3Uuid = uuidv4();

    await db.insert(users).values([
      {
        uuid: user1Uuid,
        name: "Rakoto Jean",
        email: "rakoto@example.com",
        passwordHash,
        role: "farmer",
        region: "Analamanga",
        specialty: "Rice",
        phone: "0340000000",
        avatar: "https://example.com/avatar1.jpg",
        isVerified: true,
        preferences: {
          language: "fr",
          currency: "MGA",
          newsletter: true,
          marketingEmails: false,
          orderUpdates: true,
        },
      },
      {
        uuid: user2Uuid,
        name: "Rasoa Marie",
        email: "rasoa@example.com",
        passwordHash,
        role: "buyer",
        region: "Vakinankaratra",
        phone: "0320000000",
        avatar: "https://example.com/avatar2.jpg",
        isVerified: true,
        preferences: {
          language: "fr",
          currency: "MGA",
          newsletter: false,
          marketingEmails: true,
          orderUpdates: true,
        },
      },
      {
        uuid: user3Uuid,
        name: "Randria Paul",
        email: "randria@example.com",
        passwordHash,
        role: "supplier",
        region: "Itasy",
        specialty: "Seeds",
        phone: "0330000000",
        avatar: "https://example.com/avatar3.jpg",
        isVerified: true,
        preferences: {
          language: "fr",
          currency: "MGA",
          newsletter: true,
          marketingEmails: true,
          orderUpdates: false,
        },
      },
    ]);

    console.log("Users created");

    await db.insert(addresses).values([
      {
        uuid: uuidv4(),
        userId: user1Uuid,
        name: "Rakoto Jean",
        phone: "0340000000",
        address: "Lot 123, Andohalo",
        city: "Antananarivo",
        region: "Analamanga",
        postalCode: "101",
        country: "Madagascar",
        isDefault: true,
        type: "both",
      },
      {
        uuid: uuidv4(),
        userId: user2Uuid,
        name: "Rasoa Marie",
        phone: "0320000000",
        address: "Lot 456, Ambositra",
        city: "Ambositra",
        region: "Amoron'i Mania",
        postalCode: "301",
        country: "Madagascar",
        isDefault: true,
        type: "both",
      },
      {
        uuid: uuidv4(),
        userId: user3Uuid,
        name: "Randria Paul",
        phone: "0330000000",
        address: "Lot 789, Miarinarivo",
        city: "Miarinarivo",
        region: "Itasy",
        postalCode: "201",
        country: "Madagascar",
        isDefault: true,
        type: "both",
      },
    ]);

    console.log("Addresses created");

    const [product1, product2, product3] = await db
      .insert(products)
      .values([
        {
          uuid: uuidv4(),
          name: "Premium Vanilla",
          description: "High-quality vanilla beans",
          price: "150000",
          category: "Spices",
          subcategory: "Vanilla",
          region: "Analanjirofo",
          seller: "Rakoto Jean",
          sellerId: user1Uuid,
          stock: 100,
          rating: "4.5",
          reviewCount: 20,
          image: "/placeholder.svg?height=400&width=400",
          weight: "0.1",
          isActive: true,
        },
        {
          uuid: uuidv4(),
          name: "Arabica Coffee",
          description: "Finest Arabica coffee beans",
          price: "50000",
          category: "Beverages",
          subcategory: "Coffee",
          region: "Vakinankaratra",
          seller: "Rasoa Marie",
          sellerId: user2Uuid,
          stock: 100,
          rating: "4.2",
          reviewCount: 30,
          image: "/placeholder.svg?height=400&width=400",
          weight: "0.25",
          isActive: true,
        },
        {
          uuid: uuidv4(),
          name: "Organic Rice",
          description: "Locally grown organic rice",
          price: "25000",
          category: "Grains",
          subcategory: "Rice",
          region: "Alaotra-Mangoro",
          seller: "Randria Paul",
          sellerId: user3Uuid,
          stock: 200,
          rating: "4.7",
          reviewCount: 40,
          image: "/placeholder.svg?height=400&width=400",
          weight: "1",
          isActive: true,
        },
      ])
      .returning();

    console.log("Products created");

    const ordersData = [
      {
        uuid: uuidv4(),
        orderNumber: "ORD-20250417-001",
        userId: user2Uuid,
        customer: "Rasoa Marie",
        subtotal: "200000",
        shippingCost: "10000",
        taxAmount: "16000",
        discountAmount: "0",
        total: "226000",
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: "Mobile Money",
        shippingAddress: "Lot 456, Ambositra",
        currency: "MGA",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      },
      {
        uuid: uuidv4(),
        orderNumber: "ORD-20250417-002",
        userId: user1Uuid,
        customer: "Rakoto Jean",
        subtotal: "100000",
        shippingCost: "5000",
        taxAmount: "8000",
        discountAmount: "0",
        total: "113000",
        status: "confirmed",
        paymentStatus: "paid",
        paymentMethod: "Credit Card",
        shippingAddress: "Lot 123, Andohalo",
        currency: "MGA",
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: null,
      },
    ];

    for (const order of ordersData) {
      await db.insert(orders).values(order);
    }

    console.log("Orders created");

    const orderItemsData = [
      {
        orderId: ordersData[0].uuid,
        productId: product1.uuid,
        name: "Premium Vanilla",
        price: 150000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        weight: 0.1,
        subtotal: 150000,
      },
      {
        orderId: ordersData[0].uuid,
        productId: product2.uuid,
        name: "Arabica Coffee",
        price: 50000,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
        weight: 0.25,
        subtotal: 50000,
      },
      {
        orderId: ordersData[1].uuid,
        productId: product3.uuid,
        name: "Organic Rice",
        price: 25000,
        quantity: 4,
        image: "/placeholder.svg?height=80&width=80",
        weight: 1,
        subtotal: 100000,
      },
    ];

    for (const item of orderItemsData) {
      await db.insert(orderItems).values({
        orderId: item.orderId,
        name: item.name,
        productId: item.productId,
        productUuid: item.productId,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        weight: item.weight,
        subtotal: item.subtotal,
      });
    }

    console.log("Order items created");

    await db.insert(promotions).values([
      {
        uuid: uuidv4(),
        name: "Summer Sale",
        description: "10% off all products",
        type: "percentage_discount",
        value: 10,
        code: "SUMMER10",
        startDate: new Date("2025-06-01").toISOString(),
        endDate: new Date("2025-08-31").toISOString(),
        isActive: true,
        usageCount: 0,
      } as any,
      {
        uuid: uuidv4(),
        name: "New User Discount",
        description: "Ar 5000 off for new users",
        type: "fixed_amount",
        value: 5000,
        code: "NEWUSER",
        startDate: new Date("2025-04-01").toISOString(),
        endDate: new Date("2025-04-30").toISOString(),
        isActive: true,
        usageCount: 0,
      } as any,
    ]);

    console.log("Promotions created");

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
