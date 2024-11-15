import { Request, Response } from "express";
import { getExternalAccount } from "../../services/peanut";

export const fetchBankAccount = async (req: Request, res: Response) => {
  const user = req.user;
  const externalAccountId = user?.customMetadata.bridgeExternalAccountId;

  if (!externalAccountId) {
    return res.status(404).json({ error: "External account ID not found" });
  }

  const externalAccount = await getExternalAccount(
    user?.customMetadata.bridgeCustomerId,
    user?.customMetadata.bridgeExternalAccountId
  );

  if (!externalAccount) {
    return res.status(404).json({ error: "External account not found" });
  }

  res.json(externalAccount);
};
