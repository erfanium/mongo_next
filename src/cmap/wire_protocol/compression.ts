import * as zlib from 'zlib';

import { LEGACY_HELLO_COMMAND } from '../../constants.ts';
import { PKG_VERSION } from '../../deps.ts';
import { MongoDecompressionError, MongoInvalidArgumentError } from '../../error.ts';
import type { Callback } from '../../utils.ts';
import type { OperationDescription } from '../message_stream.ts';

/** @public */
export const Compressor = Object.freeze({
  none: 0,
  snappy: 1,
  zlib: 2
} as const);

/** @public */
export type Compressor = typeof Compressor[CompressorName];

/** @public */
export type CompressorName = keyof typeof Compressor;

export const uncompressibleCommands = new Set([
  LEGACY_HELLO_COMMAND,
  'saslStart',
  'saslContinue',
  'getnonce',
  'authenticate',
  'createUser',
  'updateUser',
  'copydbSaslStart',
  'copydbgetnonce',
  'copydb'
]);

// Facilitate compressing a message using an agreed compressor
export function compress(
  self: { options: OperationDescription & zlib.ZlibOptions },
  dataToBeCompressed: Buffer,
  callback: Callback<Buffer>
): void {
  const zlibOptions = {} as zlib.ZlibOptions;
  switch (self.options.agreedCompressor) {
    // case 'snappy': { // TODO(erfan)
    //   if ('kModuleError' in Snappy) {
    //     return callback(Snappy['kModuleError']);
    //   }

    //   if (Snappy[PKG_VERSION].major <= 6) {
    //     Snappy.compress(dataToBeCompressed, callback);
    //   } else {
    //     Snappy.compress(dataToBeCompressed)
    //       .then(buffer => callback(undefined, buffer))
    //       .catch(error => callback(error));
    //   }
    //   break;
    // }
    case 'zlib':
      // Determine zlibCompressionLevel
      if (self.options.zlibCompressionLevel) {
        zlibOptions.level = self.options.zlibCompressionLevel;
      }
      zlib.deflate(dataToBeCompressed, zlibOptions, callback as zlib.CompressCallback);
      break;
    default:
      throw new MongoInvalidArgumentError(
        `Unknown compressor ${self.options.agreedCompressor} failed to compress`
      );
  }
}

// Decompress a message using the given compressor
export function decompress(
  compressorID: Compressor,
  compressedData: Buffer,
  callback: Callback<Buffer>
): void {
  if (compressorID < 0 || compressorID > Math.max(2)) {
    throw new MongoDecompressionError(
      `Server sent message compressed using an unsupported compressor. (Received compressor ID ${compressorID})`
    );
  }

  switch (compressorID) {
    // case Compressor.snappy: { // TODO(erfan)
    //   if ('kModuleError' in Snappy) {
    //     return callback(Snappy['kModuleError']);
    //   }

    //   if (Snappy[PKG_VERSION].major <= 6) {
    //     Snappy.uncompress(compressedData, { asBuffer: true }, callback);
    //   } else {
    //     Snappy.uncompress(compressedData, { asBuffer: true })
    //       .then(buffer => callback(undefined, buffer))
    //       .catch(error => callback(error));
    //   }
    //   break;
    // }
    case Compressor.zlib:
      zlib.inflate(compressedData, callback as zlib.CompressCallback);
      break;
    default:
      callback(undefined, compressedData);
  }
}
