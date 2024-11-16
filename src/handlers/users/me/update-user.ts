import { Request, Response } from "express";
import { setCustomMetadata } from "../../../services/privy";
import { snakeToCamelCase } from "../../../utils";

export const updateUser = async (req: Request, res: Response) => {
  const user = req.user!;
  const { username, mode, referrer, answer1, answer2, answer3 } = req.body;
  await setCustomMetadata(user.id, {
    ...(user.customMetadata ?? {}),
    ...(username && { username }),
    ...(mode && { mode }),
    ...(referrer && { referrer }),
    ...(answer1 && { answer1 }),
    ...(answer2 && { answer2 }),
    ...(answer3 && { answer3 }),
  });
  return res.json(snakeToCamelCase(user));
};
