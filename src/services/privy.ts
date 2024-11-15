import { PrivyClient, User } from "@privy-io/server-auth";
import { environment } from "../config/environment";

if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
  throw new Error("Please provide your Privy App ID");
}

if (!process.env.PRIVY_APP_SECRET) {
  throw new Error("Please provide your Privy App Secret");
}

const privy = new PrivyClient(
  environment.PRIVY_APP_ID,
  environment.PRIVY_APP_SECRET!
);

export const verifyAuthToken = async (
  authToken: string
): Promise<{
  user?: User;
  isValid: boolean;
}> => {
  try {
    const verifiedClaims = await privy.verifyAuthToken(authToken);
    const user = await privy.getUser(verifiedClaims.userId);
    return {
      isValid: true,
      user,
    };
  } catch (error: any) {
    return {
      isValid: false,
    };
  }
};

export const getPrivyUserByIdToken = async (idToken: string): Promise<User | null> => {
  return await privy.getUser({ idToken });
};
