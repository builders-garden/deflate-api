import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../services/privy';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const verified = await verifyAuthToken(token);

    if (!verified) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = verified.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}; 