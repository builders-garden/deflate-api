import { Request, Response } from "express";
import { createKYCLink, fetchKYCLinkById } from "../../services/peanut";
import { setCustomMetadata } from "../../services/privy";
import { snakeToCamelCase } from "../../utils";

export const createKYC = async (req: Request, res: Response) => {
  const { fullName, address, city, postalCode, country } = req.body;
  const user = req.user!;
  if (user?.customMetadata?.bridgeKycLinkId) {
    const kyc = await fetchKYCLinkById(user.customMetadata?.bridgeKycLinkId);
    return res.json(kyc);
  }

  const kycLink = await createKYCLink(
    fullName,
    user?.email?.address!,
    country !== "USA"
  );

  await setCustomMetadata(user.id, {
    ...(user.customMetadata ?? {}),
    bridgeKycLinkId: kycLink.id,
    country,
    city,
    postalCode,
    address,
    fullName,
  });

  res.json(snakeToCamelCase(kycLink));
};
