import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";
import {
  BridgeAccountOwnerType,
  BridgeAccountType,
  BridgeChainPaymentRail,
  BridgeExternalAccount,
  BridgeFiatCurrency,
  BridgeFiatPaymentRail,
  BridgeKycLink,
  BridgeLiquidationAddress,
  BridgeLiquidationAddressesResponse,
  BridgeStablecoin,
  CreateLiquidationAddress,
} from "./types";
import { environment } from "../../config/environment";

if (!environment.PEANUT_API_KEY) {
  throw new Error("PEANUT_API_KEY is not set");
}

const apiKey = environment.PEANUT_API_KEY;
const baseUrl = environment.PEANUT_API_BASE_URL;

const redirectUri = environment.PEANUT_REDIRECT_URI;

export const fetchKYCLinkById = async (
  kycLinkId: string
): Promise<BridgeKycLink> => {
  const url = new URL(`${baseUrl}/bridge/kyc-links/${kycLinkId}`);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data as BridgeKycLink;
};

export const createKYCLink = async (
  fullName: string,
  email: string,
  isEEA = false
): Promise<BridgeKycLink> => {
  const url = new URL(`${baseUrl}/bridge/kyc-links`);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      type: BridgeAccountType.IBAN,
      fullName,
      email,
      redirectUri,
      isEEA,
    }),
  });
  const data = await response.json();
  return data as BridgeKycLink;
};

export const getExternalAccount = async (
  customerId: string,
  externalAccountId: string
): Promise<BridgeExternalAccount> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts/${externalAccountId}`
  );
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data as BridgeExternalAccount;
};

export const createExternalAccount = async (
  customerId: string,
  data: {
    accountNumber: string;
    bic?: string;
    country: string;
    address: {
      street: string;
      city: string;
      country: string;
      state?: string;
      postalCode: string;
    };
    accountOwnerName: {
      firstName?: string;
      lastName?: string;
      businessName?: string;
    };
    accountType: BridgeAccountType;
    accountOwnerType: BridgeAccountOwnerType;
    routingNumber?: string;
  }
): Promise<BridgeExternalAccount> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts`
  );
  if (data.accountType === "us" && !data.routingNumber) {
    throw new Error("Routing number is required for US accounts");
  }
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData as BridgeExternalAccount;
};

export const deleteExternalAccount = async (
  customerId: string,
  externalAccountId: string
) => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/external-accounts/${externalAccountId}`
  );
  const response = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data as BridgeExternalAccount;
};

export const getCustomerDetails = async (customerId: string) => {
  const url = new URL(`${baseUrl}/bridge/customers/${customerId}`);
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const data = await response.json();
  return data;
};

export const createLiquidationAddress = async (
  customerId: string,
  data: CreateLiquidationAddress
): Promise<BridgeLiquidationAddress> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/liquidation-addresses`
  );
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData as BridgeLiquidationAddress;
};

export const getLiquidationAddresses = async (
  customerId: string
): Promise<BridgeLiquidationAddressesResponse> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/liquidation-addresses`
  );
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const responseData = await response.json();
  return responseData as BridgeLiquidationAddressesResponse;
};

export const getCustomerDrains = async (
  customerId: string
): Promise<{
  data: {
    currency: string;
    amount: string;
    receipt: {
      outgoing_amount: string;
    };
  }[];
  count: number;
}> => {
  const liquidationAddresses = await getLiquidationAddresses(customerId);

  const drains = await Promise.all(
    liquidationAddresses.data.map((l: { id: string }) =>
      getLiquidationAddressDrains(customerId, l.id)
    )
  );
  return {
    data: drains
      .flatMap((d: { data: any }) => d.data)
      .sort(
        (
          a: { created_at: string | number | Date },
          b: { created_at: string | number | Date }
        ) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    count: drains.reduce((acc: any, d: { count: any }) => acc + d.count, 0),
  };
};

export const getLiquidationAddressDrains = async (
  customerId: string,
  liquidationAddressId: string
): Promise<{
  data: {
    currency: string;
    amount: string;
    created_at: string;
    receipt: {
      outgoing_amount: string;
    };
  }[];
  count: number;
}> => {
  const url = new URL(
    `${baseUrl}/bridge/customers/${customerId}/liquidation-addresses/${liquidationAddressId}/drains`
  );
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  const responseData = await response.json();
  return responseData as {
    data: {
      currency: string;
      amount: string;
      created_at: string;
      receipt: {
        outgoing_amount: string;
      };
    }[];
    count: number;
  };
};

export const getOrCreateLiquidationAddress = async (
  customerId: string,
  externalAccountId: string,
  accountType: "us" | "iban",
  chain: BridgeChainPaymentRail
) => {
  if (!customerId || !externalAccountId || !accountType) {
    return null;
  }
  const liquidationAddresses = await getLiquidationAddresses(customerId);
  if (
    liquidationAddresses.count === 0 ||
    !liquidationAddresses.data?.find(
      (l: BridgeLiquidationAddress) =>
        l.external_account_id === externalAccountId && l.chain === chain
    )
  ) {
    const newLiquidationAddress = await createLiquidationAddress(customerId, {
      chain,
      currency: BridgeStablecoin.USDC,
      externalAccountId,
      destinationPaymentRail:
        accountType === "us"
          ? BridgeFiatPaymentRail.ACH
          : BridgeFiatPaymentRail.SEPA,
      destinationCurrency:
        accountType === "us" ? BridgeFiatCurrency.USD : BridgeFiatCurrency.EUR,
      ...(accountType === "iban"
        ? {
            destinationSepaReference: "Withdrawal from Drift",
          }
        : {
            destinationAchReference: "by Drift",
          }),
    });
    return newLiquidationAddress;
  }

  return liquidationAddresses.data.find(
    (l: BridgeLiquidationAddress) =>
      l.external_account_id === externalAccountId && l.chain === chain
  );
};

export const chainIdToBridgeChainPaymentRail = (chainId: number) => {
  switch (chainId) {
    case mainnet.id:
      return BridgeChainPaymentRail.ETHEREUM;
    case base.id:
      return BridgeChainPaymentRail.BASE;
    case polygon.id:
      return BridgeChainPaymentRail.POLYGON;
    case arbitrum.id:
      return BridgeChainPaymentRail.ARBITRUM;
    case optimism.id:
      return BridgeChainPaymentRail.OPTIMISM;
    default:
      return BridgeChainPaymentRail.BASE;
  }
};
