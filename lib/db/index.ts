import dbConnect, { checkMongoConnection } from "./mongo/connection";
import { checkPostgresConnection } from "./postgres/connection";

let isMongoConnected = false;
let isPostgresConnected = false;

export async function connectToDatabases() {
  try {
    if (!isMongoConnected) {
      await dbConnect();
      isMongoConnected = await checkMongoConnection();
    }

    if (!isPostgresConnected) {
      isPostgresConnected = await checkPostgresConnection();
    }

    return {
      mongo: isMongoConnected,
      postgres: isPostgresConnected,
    };
  } catch (error) {
    console.error("Failed to connect to databases:", error);
    return {
      mongo: isMongoConnected,
      postgres: isPostgresConnected,
      error,
    };
  }
}

export { default as mongoDb } from "./mongo/connection";
export { db as postgresDb } from "./postgres/connection";
