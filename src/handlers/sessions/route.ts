import { Request, Response } from "express";
import { redis } from "../../services/redis";

export async function sessionsRoute(request: Request, res: Response) {
  const { compressedSessionData } = request.body;
  const user = request.user!;
  const data = await redis.get(user.customMetadata.smartAccountAddress);
  if (data) {
    await redis.set(user.customMetadata.smartAccountAddress, {
      ...data,
      compressedSessionData,
    });
  } else {
    await redis.set(user.customMetadata.smartAccountAddress, {compressedSessionData});
  }
  res.json({ success: true });
}
