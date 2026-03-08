import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "event_platform";

let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function getClientPromise() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not configured. Add it in .env.local");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(MONGO_URI);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(MONGO_URI);
  return client.connect();
}

export async function getDb(): Promise<Db> {
  clientPromise = clientPromise || getClientPromise();
  const client = await clientPromise;
  return client.db(MONGO_DB_NAME);
}
