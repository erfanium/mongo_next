import { Bson } from "../deps.ts";

/** @internal */
export const deserialize = Bson.deserialize as typeof Bson.deserialize;
/** @internal */
export const serialize = Bson.serialize as typeof Bson.serialize;
/** @internal */
export const calculateObjectSize = Bson
  .calculateObjectSize as typeof Bson.calculateObjectSize;

export {
  Binary,
  BSONRegExp,
  BSONSymbol,
  Code,
  DBRef,
  Decimal128,
  Double,
  Int32,
  Long,
  MaxKey,
  MinKey,
  ObjectId,
  Timestamp,
} from "../bson.ts";
export type { Document } from "../bson.ts";

/**
 * BSON Serialization options.
 * @public
 */
export interface BSONSerializeOptions
  extends
    Omit<Bson.SerializeOptions, "index">,
    Omit<
      Bson.DeserializeOptions,
      | "evalFunctions"
      | "cacheFunctions"
      | "cacheFunctionsCrc32"
      | "allowObjectSmallerThanBufferSize"
      | "index"
      | "validation"
    > {
  /** Return BSON filled buffers from operations */
  raw?: boolean;

  /** Enable utf8 validation when deserializing BSON documents.  Defaults to true. */
  enableUtf8Validation?: boolean;
}

export function pluckBSONSerializeOptions(
  options: BSONSerializeOptions,
): BSONSerializeOptions {
  const {
    fieldsAsRaw,
    promoteValues,
    promoteBuffers,
    promoteLongs,
    serializeFunctions,
    ignoreUndefined,
    bsonRegExp,
    raw,
    enableUtf8Validation,
  } = options;
  return {
    fieldsAsRaw,
    promoteValues,
    promoteBuffers,
    promoteLongs,
    serializeFunctions,
    ignoreUndefined,
    bsonRegExp,
    raw,
    enableUtf8Validation,
  };
}

/**
 * Merge the given BSONSerializeOptions, preferring options over the parent's options, and
 * substituting defaults for values not set.
 *
 * @internal
 */
export function resolveBSONOptions(
  options?: BSONSerializeOptions,
  parent?: { bsonOptions?: BSONSerializeOptions },
): BSONSerializeOptions {
  const parentOptions = parent?.bsonOptions;
  return {
    raw: options?.raw ?? parentOptions?.raw ?? false,
    promoteLongs: options?.promoteLongs ?? parentOptions?.promoteLongs ?? true,
    promoteValues: options?.promoteValues ?? parentOptions?.promoteValues ??
      true,
    promoteBuffers: options?.promoteBuffers ?? parentOptions?.promoteBuffers ??
      false,
    ignoreUndefined: options?.ignoreUndefined ??
      parentOptions?.ignoreUndefined ?? false,
    bsonRegExp: options?.bsonRegExp ?? parentOptions?.bsonRegExp ?? false,
    serializeFunctions: options?.serializeFunctions ??
      parentOptions?.serializeFunctions ?? false,
    fieldsAsRaw: options?.fieldsAsRaw ?? parentOptions?.fieldsAsRaw ?? {},
    enableUtf8Validation: options?.enableUtf8Validation ??
      parentOptions?.enableUtf8Validation ?? true,
  };
}
