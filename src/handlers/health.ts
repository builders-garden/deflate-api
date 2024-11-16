import { Request, Response } from 'express';
import { getEnsAddress } from '../services/ens';

export const healthCheck = async (req: Request, res: Response) => {
  const ensAddress = await getEnsAddress("limone.deflateapp.eth");
  res.json({ status: "ok", ensAddress });
};