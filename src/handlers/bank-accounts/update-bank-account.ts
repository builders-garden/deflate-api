import { Request, Response } from 'express';

export const updateBankAccount = (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: req.user });
}; 