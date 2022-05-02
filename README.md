# Deno MongoDB Driver

```ts
import { MongoClient } from "./src/index.ts";

const client = new MongoClient("mongodb://localhost:27017/test");

await client.connect();
console.log("connected");

const bulk = client.db("test").collection("test").initializeUnorderedBulkOp();
bulk.find({}).updateOne({ $set: { a: 1 } });

const result = await bulk.execute();

console.log(result);
```
