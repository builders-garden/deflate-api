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
  const user = req.user!;

  if (!user.customMetadata?.bridgeExternalAccountId) {
    return res
      .status(400)
      .json({ error: "User has no bridge external account id" });
  }

  await deleteExternalAccount(
    user.customMetadata?.bridgeCustomerId,
    user.customMetadata?.bridgeExternalAccountId
  );

  const metadata = {
    ...user.customMetadata,
    bridgeExternalAccountId: null,
  };

  await setCustomMetadata(user.id, metadata);

  res.json({ message: "ok" });
};
