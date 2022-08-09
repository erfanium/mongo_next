import {
  deserialize as nativeDeserialize,
  serialize as nativeSerialize,
} from "https://deno.land/x/web_bson@v0.2.1/mod.ts";
import { Buffer } from "./deps.ts";

export {
  Binary,
  BinarySizes,
  BSONRegExp,
  BSONSymbol,
  calculateObjectSize,
  Code,
  DBRef,
  Decimal128,
  Double,
  Int32,
  Long,
  LongWithoutOverridesClass,
  MaxKey,
  MinKey,
  ObjectId,
  Timestamp,
  UUID,
} from "https://deno.land/x/web_bson@v0.2.1/mod.ts";

export type {
  DeserializeOptions,
  Document,
  SerializeOptions,
} from "https://deno.land/x/web_bson@v0.2.1/mod.ts";

export function serialize(object: any, options: any) {
  return Buffer.from(nativeSerialize(object, options));
}

export function deserialize(buffer: Buffer, options: any) {
  return nativeDeserialize(new Uint8Array(buffer), options);
}
