export enum BridgeKycStatus {
  NOT_STARTED = "not_started",
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  INCOMPLETE = "incomplete",
  AWAITING_UBO = "awaiting_ubo",
  MANUAL_REVIEW = "manual_review",
  UNDER_REVIEW = "under_review",
}

export enum BridgeTosStatus {
  PENDING = "pending",
  APPROVED = "approved",
}

export interface BridgeKycLink {
  id: string;
  email: string;
  type: "business";
  kyc_link: string;
  tos_link: string;
  kyc_status: BridgeKycStatus;
  tos_status: BridgeTosStatus;
  created_at: string; // ISO 8601 date string
  customer_id?: string;
}

export interface BridgeExternalAccount {
  id: string;
  customer_id?: string;
  currency?: "usd" | "eur";
  bank_name?: string;
  account_owner_name: string;
  account_number?: string;
  routing_number?: string;
  account_type: BridgeAccountType;
  iban?: {
    last_4?: string;
    account_number: string;
    bic: string;
    country: string;
  };
  account?: {
    account_number: string;
    routing_number: string;
    checking_or_savings?: string;
  };
  account_owner_type: "business" | "individual";
  first_name?: string;
  last_name?: string;
  business_name?: string;
  address?: {
    street_line_1: string;
    street_line_2?: string;
    city: string;
    country: string;
    state?: string;
    postal_code?: string;
  };
}

export enum BridgeAccountOwnerType {
  BUSINESS = "business",
  INDIVIDUAL = "individual",
}

export enum BridgeAccountType {
  IBAN = "iban",
  US = "us",
}

export interface BridgeExternalAccountCamel {
  id: string;
  currency?: "usd" | "eur";
  bankName?: string;
  accountOwnerName: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType: BridgeAccountType;
  iban?: {
    last_4?: string;
    accountNumber: string;
    bic: string;
    country: string;
  };
  account?: {
    accountNumber: string;
    routingNumber: string;
    checkingOrSavings?: string;
  };
  accountOwnerType: BridgeAccountOwnerType;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  address?: {
    streetLine1: string;
    streetLine2?: string;
    city: string;
    country: string;
    state?: string;
    postalCode?: string;
  };
}

export enum BridgeChainPaymentRail {
  ETHEREUM = "ethereum",
  POLYGON = "polygon",
  BASE = "base",
  OPTIMISM = "optimism",
  SOLANA = "solana",
  STELLAR = "stellar",
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalance_c_chain",
}

export enum BridgeFiatPaymentRail {
  ACH = "ach",
  ACH_PUSH = "ach_push",
  ACH_SAME_DAY = "ach_same_day",
  WIRE = "wire",
  SEPA = "sepa",
  SWIFT = "swift",
}

export enum BridgeStablecoin {
  USDC = "usdc",
  EURC = "eurc",
  USDT = "usdt",
  DAI = "dai",
}

export enum BridgeFiatCurrency {
  USD = "usd",
  EUR = "eur",
}

export interface BridgeTransferSource {
  payment_rail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
  currency: BridgeStablecoin | BridgeFiatCurrency;
  from_address?: string;
  external_account_id?: string;
}

export interface BridgeTransferDestination {
  payment_rail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
  currency: BridgeStablecoin | BridgeFiatCurrency;
  to_address?: string;
  external_account_id?: string;
  wire_message?: string;
  sepa_reference?: string;
  ach_reference?: string;
}

export interface NewBridgeTransfer {
  amount: string;
  developer_fee?: string;
  on_behalf_of: string; // customer_id
  source: BridgeTransferSource;
  destination: BridgeTransferDestination;
}

export interface BridgeTransfer {
  id: string;
  client_reference_id?: string;
  amount: string;
  currency: "usd" | "eur";
  on_behalf_of: string;
  developer_fee: string;
  source: {
    currency: BridgeFiatCurrency | BridgeStablecoin;
    payment_rail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
    external_account_id?: string;
    omad?: string;
    imad?: string;
    bank_beneficiary_name?: string;
    bank_routing_number?: string;
    bank_name?: string;
    description?: string;
    from_address?: string;
  };
  destination: {
    currency: BridgeFiatCurrency | BridgeStablecoin;
    payment_rail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
    external_account_id?: string;
    omad?: string;
    imad?: string;
    trace_number?: string;
    sepa_reference?: string;
    ach_reference?: string;
    wire_message?: string;
    swift_reference?: string;
    blockchain_memo?: string;
    to_address?: string;
  };
  state: BridgeTransferState;
  source_deposit_instructions: {
    payment_rail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
    amount: string;
    currency: BridgeFiatCurrency | BridgeStablecoin;
    from_address?: string;
    to_address?: string;
    deposit_message?: string;
    bank_name?: string;
    bank_address?: string;
    bank_routing_number?: string;
    bank_account_number?: string;
    bank_beneficiary_name?: string;
    iban?: string;
    bic?: string;
    account_holder_name?: string;
  };
  receipt: {
    initial_amount: string;
    developer_fee: string;
    exchange_fee: string;
    subtotal_amount: string;
    remaining_prefunded_amount?: string;
    gas_fee?: string;
    final_amount?: string;
    source_tx_hash?: string;
    destination_tx_hash?: string;
    exchange_rate?: string;
    url?: string;
  };
  return_details?: {
    reason?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export enum BridgeTransferState {
  AWAITING_FUNDS = "awaiting_funds",
  IN_REVIEW = "in_review",
  FUNDS_RECEIVED = "funds_received",
  PAYMENT_SUBMITTED = "payment_submitted",
  PAYMENT_PROCESSED = "payment_processed",
  RETURNED = "returned",
  REFUNDED = "refunded",
  CANCELED = "canceled",
  COMPLETED = "completed",
  FAILED = "failed",
  ERROR = "error",
}

export interface BridgeTransfersResponse {
  count: number;
  data: BridgeTransfer[];
}

export interface CreateLiquidationAddress {
  chain: BridgeChainPaymentRail;
  currency: BridgeStablecoin;
  externalAccountId?: string;
  destinationSepaReference?: string;
  destinationAchReference?: string;
  destinationPaymentRail: BridgeChainPaymentRail | BridgeFiatPaymentRail;
  destinationCurrency: BridgeFiatCurrency;
}

export interface BridgeLiquidationAddressesResponse {
  count: number;
  data: BridgeLiquidationAddress[];
}

export interface BridgeLiquidationAddress {
  id: string;
  chain: BridgeChainPaymentRail;
  currency: BridgeStablecoin;
  address: string;
  external_account_id?: string;
  prefunded_account_id?: string;
  destination_wire_message?: string;
  destination_sepa_reference?: string;
  destination_swift_reference?: string;
  destination_ach_reference?: string;
  destination_payment_rail?: BridgeChainPaymentRail | BridgeFiatPaymentRail;
  destination_address?: string;
  destination_currency: BridgeStablecoin | BridgeFiatCurrency;
  destination_blockchain_memo?: string;
  custom_developer_fee_percent?: string;
  state?: "active" | "deactivated";
  created_at: Date;
  updated_at: Date;
}

export interface BridgeLiquidationAddressDrainsResponse {
  count: number;
  data: BridgeLiquidationAddressDrain[];
}

export enum BridgeDrainState {
  AWAITING_FUNDS = "awaiting_funds",
  IN_REVIEW = "in_review",
  FUNDS_RECEIVED = "funds_received",
  PAYMENT_SUBMITTED = "payment_submitted",
  PAYMENT_PROCESSED = "payment_processed",
  CANCELED = "canceled",
  ERROR = "error",
  RETURNED = "returned",
  REFUNDED = "refunded",
}

export interface BridgeLiquidationAddressDrain {
  id: string;
  amount: string;
  customer_id: string;
  liquidation_address_id: string;
  currency: "usdc" | "eurc";
  state: BridgeDrainState;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  deposit_tx_hash: string;
  destination: BridgeDestination;
  receipt: BridgeReceipt;
}

export interface BridgeDestination {
  payment_rail: "wire" | "ach" | "sepa";
  currency: "usd" | "eur";
  external_account_id: string;
  wire_message?: string;
  imad?: string;
}

export interface BridgeReceipt {
  initial_amount: string;
  developer_fee: string;
  subtotal_amount: string;
  exchange_rate: string;
  converted_amount: string;
  outgoing_amount: string;
  destination_currency: "usd" | "eur";
  url: string;
}
