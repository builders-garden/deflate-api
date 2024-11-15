import { Request, Response } from "express";
import { getCustomerDrains } from "../../services/peanut";

export const fetchWithdrawals = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user?.customMetadata.bridgeCustomerId) {
    return res.status(400).json({ error: "User has no bridge customer id" });
  }
  const drains = await getCustomerDrains(user.customMetadata.bridgeCustomerId);
  return res.json(drains);
};
