import { Request, Response } from "express";
import { setCustomMetadata } from "../../../services/privy";
import { snakeToCamelCase } from "../../../utils";
import { createAttestation } from "../../../services/sign-protocol";

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
  if (!user?.customMetadata?.referrer && referrer) {
    await createAttestation({
      referredENS: `${username}.deflateapp.eth`,
      referrerENS: `${referrer}.deflateapp.eth`,
    });
  }
  return res.json(snakeToCamelCase(user));
};
