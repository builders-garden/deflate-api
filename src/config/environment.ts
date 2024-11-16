import dotenv from "dotenv";

dotenv.config();

export const environment = {
  PORT: process.env.PORT as string,
  PRIVY_APP_ID: process.env.PRIVY_APP_ID as string,
  PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET as string,
  SUPABASE_URL: process.env.SUPABASE_URL as string,
  SUPABASE_ADMIN_KEY: process.env.SUPABASE_ADMIN_KEY as string,
  PEANUT_API_KEY: process.env.PEANUT_API_KEY as string,
  PEANUT_API_BASE_URL: process.env.PEANUT_API_BASE_URL as string,
  PEANUT_REDIRECT_URI: process.env.PEANUT_REDIRECT_URI as string,
  AGENT_PRIVATE_KEY: process.env.AGENT_PRIVATE_KEY as string,
  BRIAN_API_KEY: process.env.BRIAN_API_KEY as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  ONE_INCH_API_KEY: process.env.ONE_INCH_API_KEY as string,
  REDIS_URL: process.env.REDIS_URL as string,
  REDIS_TOKEN: process.env.REDIS_TOKEN as string,
};
