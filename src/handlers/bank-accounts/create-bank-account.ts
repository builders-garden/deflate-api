import { Request, Response } from "express";
import { createExternalAccount } from "../../services/peanut";
import {
  BridgeAccountOwnerType,
  BridgeAccountType,
} from "../../services/peanut/types";
import { setCustomMetadata } from "../../services/privy";
import { snakeToCamelCase } from "../../utils";

export const createBankAccount = async (req: Request, res: Response) => {
  const body = req.body;
  const user = req.user!;

  if (!body.accountNumber || !body.routingNumber) {
    res
      .status(422)
      .json({ message: "Account number and routing number are required" });
    return;
  }

  if (!user.customMetadata?.bridgeCustomerId) {
    res.json({
      message: "Start KYC first.",
    });
    return;
  }

  if (user.customMetadata?.accountNumber) {
    res.json({
      message: "Already connected a bank account. Delete it first.",
    });
    return;
  }

  const externalAccount = await createExternalAccount(
    user.customMetadata?.bridgeCustomerId,
    {
      accountNumber: body.accountNumber,
      ...(user.customMetadata?.country === "USA"
        ? { routingNumber: body.routingNumber }
        : { bic: body.routingNumber }),
      country: user.customMetadata?.country,
      address: {
        street: user.customMetadata?.address,
        city: user.customMetadata?.city,
        country: user.customMetadata?.country,
        state: user.customMetadata?.state,
        postalCode: user.customMetadata?.postalCode,
      },
      accountOwnerName: {
        firstName: user.customMetadata?.firstName,
        lastName: user.customMetadata?.lastName,
      },
      accountType:
        user.customMetadata?.country === "USA"
          ? BridgeAccountType.US
          : BridgeAccountType.IBAN,
      accountOwnerType: BridgeAccountOwnerType.INDIVIDUAL,
    }
  );

  const metadata = {
    ...user.customMetadata,
    bridgeExternalAccountId: externalAccount.id,
  };

  await setCustomMetadata(user.id, metadata);

  res.json(snakeToCamelCase(externalAccount));
};
