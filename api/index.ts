import app from '../server/index';
import { connectToDatabase } from '../server/db/connection';

/**
 * Vercel Serverless Function entry point
 * Dispatches all /api/* requests to the Express application
 */
export default async function handler(req: any, res: any) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
    }
  } catch (err) {
    console.error('Database connection error in Vercel handler:', err);
  }
  return app(req, res);
}
