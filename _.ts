import { MongoClient } from "./src/index.ts";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("test");
const collection = db.collection("test");

console.log(await collection.findOne({}));
