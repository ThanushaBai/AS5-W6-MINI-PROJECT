import { Event } from "@/types/event"
import { getDb } from "@/lib/mongodb";
import { User } from "@/types/user";

const EVENT_COLLECTION = "events";
const USER_COLLECTION = "users";
let userIndexesPromise: Promise<void> | null = null;

export async function getEvents() {
  const db = await getDb();
  return db.collection<Event>(EVENT_COLLECTION).find({}).sort({ createdAt: -1 }).toArray();
}

export async function getRecentEvents(limit = 5) {
  const db = await getDb();
  return db.collection<Event>(EVENT_COLLECTION).find({}).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function getEventCount() {
  const db = await getDb();
  return db.collection<Event>(EVENT_COLLECTION).countDocuments();
}

export async function getUpcomingEventCount() {
  const db = await getDb();
  return db.collection<Event>(EVENT_COLLECTION).countDocuments({
    date: { $gte: new Date().toISOString().split("T")[0] }
  });
}

export async function getEventBySlug(slug: string) {
  const db = await getDb();
  return db.collection<Event>(EVENT_COLLECTION).findOne({ slug });
}

export async function addEvent(event: Event) {
  const db = await getDb();
  await db.collection<Event>(EVENT_COLLECTION).insertOne(event);
  return event;
}

export async function updateEventBySlug(slug: string, updates: Partial<Event>) {
  const db = await getDb();
  const result = await db.collection<Event>(EVENT_COLLECTION).findOneAndUpdate(
    { slug },
    { $set: updates },
    { returnDocument: "after" }
  );
  return result;
}

export async function deleteEventBySlug(slug: string) {
  const db = await getDb();
  const result = await db.collection<Event>(EVENT_COLLECTION).deleteOne({ slug });
  return result.deletedCount > 0;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  return db.collection<User>(USER_COLLECTION).findOne({ username });
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.collection<User>(USER_COLLECTION).findOne({ email });
}

export async function getUserByUsernameOrEmail(identifier: string) {
  const db = await getDb();
  return db.collection<User>(USER_COLLECTION).findOne({
    $or: [{ username: identifier }, { email: identifier }]
  });
}

export async function addUser(user: User) {
  const db = await getDb();
  await db.collection<User>(USER_COLLECTION).insertOne(user);
  return user;
}

export async function getUserCount() {
  const db = await getDb();
  return db.collection<User>(USER_COLLECTION).countDocuments();
}

export async function ensureUserIndexes() {
  if (!userIndexesPromise) {
    userIndexesPromise = (async () => {
      const db = await getDb();
      const users = db.collection<User>(USER_COLLECTION);
      await users.createIndex({ username: 1 }, { unique: true });
      await users.createIndex({ email: 1 }, { unique: true });
    })();
  }

  await userIndexesPromise;
}
