import { Request, Response } from "express";
import { fetchKYCLinkById } from "../../services/peanut";
import { snakeToCamelCase } from "../../utils";

export const fetchKYC = async (req: Request, res: Response) => {
  const user = req.user!;
  if (!user.customMetadata?.bridgeKycLinkId) {
    return res.status(400).json({ error: "User has no KYC link id" });
  }
  const kyc = await fetchKYCLinkById(user.customMetadata?.bridgeKycLinkId);
  if (!kyc) {
    return res.status(404).json({ error: "KYC link not found" });
  }
  return res.json(snakeToCamelCase(kyc));
};
