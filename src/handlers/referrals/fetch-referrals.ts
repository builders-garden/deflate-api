import { getAttestations } from "../../services/sign-protocol";
import { Request, Response } from "express";

export const fetchReferrals = async (req: Request, res: Response) => {
  const user = req.user!;
  if (!user.customMetadata.username) {
    return res.status(400).json({ error: "Set a username first" });
  }
  const attestations = await getAttestations({
    referredENS: `${user.customMetadata.username}.deflateapp.eth`,
  });
  res.json(attestations);
};
