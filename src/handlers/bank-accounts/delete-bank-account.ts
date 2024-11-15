import { Request, Response } from "express";
import {
  createExternalAccount,
  deleteExternalAccount,
} from "../../services/peanut";
import {
  BridgeAccountOwnerType,
  BridgeAccountType,
} from "../../services/peanut/types";
import { setCustomMetadata } from "../../services/privy";

export const deleteBankAccount = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  await deleteExternalAccount(user.customMetadata.bridgeCustomerId, id);

  const metadata = {
    ...user.customMetadata,
    bridgeExternalAccountId: null,
  };

  await setCustomMetadata(user.id, metadata);

  res.json({ message: "ok" });
};
