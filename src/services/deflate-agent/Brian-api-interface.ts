/**
 * @dev Extracted action.
 */
type Action =
  | "swap"
  | "transfer"
  | "bridge"
  | "balance"
  | "wrap native"
  | "unwrap native"
  | "totalsupply"
  | "approve"
  | "deposit"
  | "stake on Lido"
  | "withdraw"
  | "ENS Forward Resolution"
  | "ENS Reverse Resolution"
  | "ENS Availability"
  | "ENS Expiration"
  | "ENS Registration Cost"
  | "ENS Renewal Cost"
  | "ENS Registration"
  | "ENS Renewal"
  | "AAVE Borrow"
  | "AAVE Repay"
  | "Aave User Data"
  | "Find protocol";



/**
 * @dev Response body received from /agent/transaction.
 * @property {TransactionResult[]} result - The results from the Brian API.
 */
export type TransactionResponse = {
    result: TransactionResult[];
};
  
export type TransactionResult = {
    type: "read" | "write";
    action: Action;
    data: TransactionData;
    solver: string;
};

/**
 * @dev Transaction data.
 * @property {TransactionStep[]} steps - The steps of the transaction.
 * @property {string} description - The description of the transaction.
 * @property {number} fromChainId - The chain ID to send the transaction from.
 * @property {string} fromAmount - The amount to send from the transaction.
 * @property {Token} fromToken - The token to send from the transaction.
 * @property {string} fromAddress - The address to send from the transaction.
 * @property {number} toChainId - The chain ID to send the transaction to.
 * @property {string} toAmount - The amount to send to the transaction.
 * @property {string} toAmountMin - The minimum amount to send to the transaction.
 * @property {Token} toToken - The token to send to the transaction.
 * @property {string} toAddress - The address to send to the transaction.
 */
export type TransactionData = {
    description: string;
    steps?: TransactionStep[];
    fromChainId?: number;
    fromAmount?: `${number}`;
    fromToken?: Token;
    fromAddress?: `0x${string}`;
    toChainId?: number;
    toAmount?: `${number}`;
    toAmountMin?: `${number}`;
    toToken?: Token;
    toAddress?: `0x${string}`;
};

/**
 * @dev Transaction step.
 * @property {number} chainId - The chain ID of the transaction step.
 * @property {number} blockNumber - The block number of the transaction step.
 * @property {string} from - The from address of the transaction step.
 * @property {string} to - The to address of the transaction step.
 * @property {string} value - The value of the transaction step.
 * @property {string} data - The data of the transaction step.
 */
export type TransactionStep = {
    chainId: number;
    blockNumber?: number;
    from: `0x${string}`;
    to: `0x${string}`;
    value: `${number}`;
    data: `0x${string}`;
  };
  

  /**
 * @dev Token type.
 * @property {string} address - The address of the token.
 * @property {number} chainId - The chain ID of the token.
 * @property {string} symbol - The symbol of the token.
 * @property {number} decimals - The decimals of the token.
 * @property {string} name - The name of the token.
 * @property {string} coinKey - The coin key of the token.
 * @property {string} logoURI - The logo URI of the token.
 * @property {string} priceUSD - The price of the token in USD.
 */
export type Token = {
    address: `0x${string}`;
    chainId: number;
    symbol: string;
    decimals: number;
    name: string;
    coinKey?: string;
    logoURI?: string;
    priceUSD?: string;
  };