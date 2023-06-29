import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URL, {
    monitorCommands: true,
    connectTimeoutMS: 5000,
  });
  await client.connect();
  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db(process.env.MONGODB_DB);
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function findOneDocument(client, collection, documentToFind) {
  const db = client.db(process.env.MONGODB_DB);
  const result = await db
    .collection(collection)
    .findOne(documentToFind)
    .toArray();
  return result;
}

function name(params) {}
