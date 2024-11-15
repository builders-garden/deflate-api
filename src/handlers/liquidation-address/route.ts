import { Request, Response } from "express";
import { getOrCreateLiquidationAddress } from "../../services/peanut";
import { BridgeChainPaymentRail } from "../../services/peanut/types";

export const fetchLiquidationAddress = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user?.customMetadata.bridgeCustomerId) {
    return res.status(400).json({ error: "User has no bridge customer id" });
  }
  const liquidationAddress = await getOrCreateLiquidationAddress(
    user?.customMetadata.bridgeCustomerId,
    user?.customMetadata.bridgeExternalAccountId,
    user?.customMetadata.country === "USA" ? "us" : "iban",
    BridgeChainPaymentRail.BASE
  );
  return res.json(liquidationAddress);
};
