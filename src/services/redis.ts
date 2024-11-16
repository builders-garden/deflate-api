import { environment } from "../config/environment";
import { Redis } from "@upstash/redis";

if (!environment.REDIS_URL || !environment.REDIS_TOKEN) {
  throw new Error("REDIS_URL and REDIS_TOKEN must be set");
}

export const redis = new Redis({
  url: environment.REDIS_URL,
  token: environment.REDIS_TOKEN,
});
