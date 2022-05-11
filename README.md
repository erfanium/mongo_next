# Deno MongoDB Driver

(experimental) full-featured MongoDB driver for Deno.

- Use with `no-check` and `unstable` flags for now

```ts
import { MongoClient } from "./src/index.ts";

const client = new MongoClient("mongodb://localhost:27017/test");

await client.connect();
console.log("connected");

const bulk = client.db("test")
  .collection("test")
  .initializeUnorderedBulkOp();
bulk.find({}).updateOne({ $set: { a: 1 } });

const result = await bulk.execute();

console.log(result);
```

## Roadmap

if you are interested to contribute to this project, we're planning to do these
tasks:

- remove all `std/node` dependencies
- use `x/web_bson` as bson library
- refactor callback based apis with async functions
- use async iterators instead of node's streams (in cursors)
