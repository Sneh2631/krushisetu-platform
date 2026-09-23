import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models';

export interface AuthenticatedUser {
  userId: string;
  name: string;
  phone: string;
  role: 'farmer' | 'buyer' | 'admin';
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.AUTH_SECRET || 'krishisetu_super_secret_jwt_auth_key_replace_in_production_9142';

/**
 * Generate a signed JWT session token for authenticated user
 */
export function generateToken(user: any): string {
  const userId = user._id ? user._id.toString() : (user.userId || user.id || 'user');
  return jwt.sign(
    {
      userId,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Authentication Middleware: Validates Bearer token or mock session in development
 */
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.token;

  if (!token) {
    // If headers provide X-User-Id / X-User-Role in local testing mode
    const devUserId = req.headers['x-user-id'] as string;
    const devRole = req.headers['x-user-role'] as 'farmer' | 'buyer' | 'admin';
    if (devUserId && devRole) {
      req.user = {
        userId: devUserId,
        name: (req.headers['x-user-name'] as string) || 'Demo User',
        phone: (req.headers['x-user-phone'] as string) || '9876543210',
        role: devRole,
      };
      return next();
    }

    res.status(401).json({ error: 'Unauthorized. Please login to continue.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

/**
 * Optional Authentication: Attaches user if token is present, does not reject otherwise
 */
export async function optionalAuthenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.cookies?.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      req.user = decoded;
    } catch (_) {}
  } else {
    const devUserId = req.headers['x-user-id'] as string;
    const devRole = req.headers['x-user-role'] as 'farmer' | 'buyer' | 'admin';
    if (devUserId && devRole) {
      req.user = {
        userId: devUserId,
        name: (req.headers['x-user-name'] as string) || 'Demo User',
        phone: (req.headers['x-user-phone'] as string) || '9876543210',
        role: devRole,
      };
    }
  }
  next();
}

/**
 * Require specific user role
 */
export function requireRole(...roles: ('farmer' | 'buyer' | 'admin')[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Forbidden. Action requires one of: [${roles.join(', ')}]. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}
