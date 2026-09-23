import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

/**
 * Global cache interface for Mongoose connection across dev hot-reloads
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  mongodInstance: any;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  mongodInstance: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Helper to test if a standalone MongoDB instance is responding on a given URI
 */
async function testConnection(uri: string, timeoutMs = 1500): Promise<boolean> {
  let testConn: typeof mongoose | null = null;
  try {
    testConn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: timeoutMs,
      connectTimeoutMS: timeoutMs,
    }).asPromise();
    const isOk = testConn.readyState === 1;
    await testConn.close();
    return isOk;
  } catch {
    if (testConn) {
      try {
        await testConn.close();
      } catch (_) {}
    }
    return false;
  }
}

/**
 * Resolves the active MongoDB connection URI:
 * 1. MONGODB_URI (e.g. MongoDB Atlas cluster) if set
 * 2. Local MongoDB on 27017 if running
 * 3. Embedded persistent MongoDB engine (wiredTiger in .mongo-data)
 */
export async function resolveMongoUri(): Promise<string> {
  // 1. Explicit MongoDB Atlas / remote URI provided
  if (process.env.MONGODB_URI && process.env.MONGODB_URI.trim()) {
    return process.env.MONGODB_URI.trim();
  }

  // 2. Check if local MongoDB daemon is running on port 27017
  const devUri = process.env.MONGODB_DEV_URI || 'mongodb://127.0.0.1:27017/krishisetu_db';
  const isLocalRunning = await testConnection(devUri, 1200);
  if (isLocalRunning) {
    console.log(`📡 [MongoDB] Connected to local MongoDB daemon at ${devUri}`);
    return devUri;
  }

  // 3. Launch or reuse local embedded persistent MongoDB engine (Local development only)
  if (cached.mongodInstance) {
    return cached.mongodInstance.getUri('krishisetu_db');
  }

  // In Vercel / serverless environment, local embedded binary cannot run
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    throw new Error('MONGODB_URI environment variable is required when deployed on Vercel. Please add your MongoDB Atlas cluster URI to your Vercel Project Settings > Environment Variables.');
  }

  console.log('📦 [MongoDB] Initializing persistent local MongoDB database (.mongo-data)...');
  const dbPath = path.join(process.cwd(), '.mongo-data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: {
        dbPath,
        storageEngine: 'wiredTiger',
        launchTimeout: 60000,
      },
    });
    cached.mongodInstance = mongod;
    const uri = mongod.getUri('krishisetu_db');
    console.log(`✅ [MongoDB Engine] Embedded persistent MongoDB running at ${uri}`);
    return uri;
  } catch (err: any) {
    console.warn('⚠️ [MongoDB Engine] Persistent init fallback to in-memory:', err.message);
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongodFallback = await MongoMemoryServer.create({
      instance: { launchTimeout: 60000 },
    });
    cached.mongodInstance = mongodFallback;
    return mongodFallback.getUri('krishisetu_db');
  }
}

/**
 * Connect to MongoDB Atlas / Local MongoDB using a cached singleton connection
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const mongoUri = await resolveMongoUri();

      const opts: mongoose.ConnectOptions = {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      };

      const m = await mongoose.connect(mongoUri, opts);
      console.log(`✅ [MongoDB] Successfully connected to database: ${m.connection.name}`);
      return m;
    })().catch((err) => {
      cached.promise = null;
      console.error('❌ [MongoDB] Connection failed:', err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 [MongoDB] Disconnected from database.');
  }
  if (cached.mongodInstance) {
    await cached.mongodInstance.stop();
    cached.mongodInstance = null;
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
