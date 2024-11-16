import { Request, Response } from "express";
import { fetchKYCLinkById } from "../../services/peanut";
import { snakeToCamelCase } from "../../utils";

export const fetchKYC = async (req: Request, res: Response) => {
  const { id } = req.params;
  const kyc = await fetchKYCLinkById(id);
  if (!kyc) {
    return res.status(404).json({ error: "KYC link not found" });
  }
  return res.json(snakeToCamelCase(kyc));
};
