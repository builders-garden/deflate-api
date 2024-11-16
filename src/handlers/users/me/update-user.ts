import { Request, Response } from "express";
import { setCustomMetadata } from "../../../services/privy";
import { snakeToCamelCase } from "../../../utils";

export const updateUser = async (req: Request, res: Response) => {
  const user = req.user!;
  const { username } = req.body;
  if (username) {
    await setCustomMetadata(user.id, {
      ...(user.customMetadata ?? {}),
      username,
    });
  }
  return res.json(snakeToCamelCase(user));
};
