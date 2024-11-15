import { Request, Response } from "express";
import {
  createKYCLink,
  fetchKYCLinkById,
} from "../../services/peanut";

export const createKYC = async (req: Request, res: Response) => {
  const { fullName, address, city, postalCode, country } = req.body;
  const user = req.user;
  if (user?.customMetadata.bridgeKycLinkId) {
    const kyc = await fetchKYCLinkById(user.customMetadata.bridgeKycLinkId);
    return res.json(kyc);
  }

  const kycLink = await createKYCLink(
    fullName,
    user?.email?.address!,
    country !== "USA"
  );

  res.json(kycLink);
};
