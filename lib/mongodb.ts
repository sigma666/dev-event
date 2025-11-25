import mongoose, { Mongoose } from 'mongoose';

/**
 * MongoDB connection URI.
 *
 * Must be provided via the MONGODB_URI environment variable.
 * Throwing here fails fast during boot if it is missing, instead of
 * failing later on first request.
 */
const MONGODB_URI: string = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside your environment configuration.');
}

/**
 * Shape of the cached Mongoose connection stored on the Node.js global object.
 *
 * This avoids creating multiple connections during development when Next.js
 * hot-reloads modules on file changes.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment the Node.js global type with our `mongoose` cache field.
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Use a global variable in development to preserve the Mongoose connection
 * across module reloads caused by HMR (Hot Module Replacement).
 *
 * In production, the module is only evaluated once per Lambda/Node process,
 * so this cache is effectively per-process.
 */
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Acquire a singleton Mongoose connection, creating and caching it if needed.
 *
 * If a connection is already established it is reused; concurrent callers share
 * the same in-flight connection attempt when a new connection is being created.
 *
 * @returns The active Mongoose connection instance
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    // Reuse existing connection if it is already established.
    return cached.conn;
  }

  if (!cached.promise) {
    // Create a new connection promise and cache it so that
    // concurrent calls share the same in-flight connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI, {
      // Add common, production-friendly options here if needed.
      // For example, you might enable connection pooling options.
      // See: https://mongoosejs.com/docs/connections.html
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}