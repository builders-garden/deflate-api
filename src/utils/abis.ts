export const DEFLATE_PORTAL_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_usdcAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_routerAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_supportedTokens",
        type: "address[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AlreadyInitialized",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "txData",
        type: "bytes",
      },
    ],
    name: "executeStrategy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "routerAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "routerFunctionSelector",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "supportedTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "usdcTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "txData",
        type: "bytes",
      },
    ],
    name: "validatePortalCalldata",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

export const DEFLATE_SUBDOMAIN_REGISTRAR_ABI = [
  {
    inputs: [
      {
        internalType: "contract IL2Registry",
        name: "_registry",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "label",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "NameRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "label",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "available",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "targetRegistry",
    outputs: [
      {
        internalType: "contract IL2Registry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const PORTAL_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_admin", type: "address" },
      {
        internalType: "contract IPortalsMulticall",
        name: "_multicall",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "uint256", name: "outputAmount", type: "uint256" },
      { internalType: "uint256", name: "minOutputAmount", type: "uint256" },
    ],
    name: "InsufficientBuy",
    type: "error",
  },
  { inputs: [], name: "InvalidShortString", type: "error" },
  {
    inputs: [{ internalType: "string", name: "str", type: "string" }],
    name: "StringTooLong",
    type: "error",
  },
  { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "inputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "inputAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "outputToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "outputAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "broadcaster",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "partner",
        type: "address",
      },
    ],
    name: "Portal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "domainSeparator",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { internalType: "bytes1", name: "fields", type: "bytes1" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "version", type: "string" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "verifyingContract", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "invalidateNextOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "uint256", name: "inputAmount", type: "uint256" },
              { internalType: "address", name: "outputToken", type: "address" },
              {
                internalType: "uint256",
                name: "minOutputAmount",
                type: "uint256",
              },
              { internalType: "address", name: "recipient", type: "address" },
            ],
            internalType: "struct IPortalsRouter.Order",
            name: "order",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
              { internalType: "uint256", name: "amountIndex", type: "uint256" },
            ],
            internalType: "struct IPortalsMulticall.Call[]",
            name: "calls",
            type: "tuple[]",
          },
        ],
        internalType: "struct IPortalsRouter.OrderPayload",
        name: "orderPayload",
        type: "tuple",
      },
      { internalType: "address", name: "partner", type: "address" },
    ],
    name: "portal",
    outputs: [
      { internalType: "uint256", name: "outputAmount", type: "uint256" },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "uint256", name: "inputAmount", type: "uint256" },
              { internalType: "address", name: "outputToken", type: "address" },
              {
                internalType: "uint256",
                name: "minOutputAmount",
                type: "uint256",
              },
              { internalType: "address", name: "recipient", type: "address" },
            ],
            internalType: "struct IPortalsRouter.Order",
            name: "order",
            type: "tuple",
          },
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
              { internalType: "uint256", name: "amountIndex", type: "uint256" },
            ],
            internalType: "struct IPortalsMulticall.Call[]",
            name: "calls",
            type: "tuple[]",
          },
        ],
        internalType: "struct IPortalsRouter.OrderPayload",
        name: "orderPayload",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes", name: "signature", type: "bytes" },
          { internalType: "bool", name: "splitSignature", type: "bool" },
          { internalType: "bool", name: "daiPermit", type: "bool" },
        ],
        internalType: "struct IPortalsRouter.PermitPayload",
        name: "permitPayload",
        type: "tuple",
      },
      { internalType: "address", name: "partner", type: "address" },
    ],
    name: "portalWithPermit",
    outputs: [
      { internalType: "uint256", name: "outputAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "inputToken",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "inputAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "outputToken",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "minOutputAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                  },
                ],
                internalType: "struct IPortalsRouter.Order",
                name: "order",
                type: "tuple",
              },
              { internalType: "bytes32", name: "routeHash", type: "bytes32" },
              { internalType: "address", name: "sender", type: "address" },
              { internalType: "uint64", name: "deadline", type: "uint64" },
              { internalType: "uint64", name: "nonce", type: "uint64" },
            ],
            internalType: "struct IPortalsRouter.SignedOrder",
            name: "signedOrder",
            type: "tuple",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
              { internalType: "uint256", name: "amountIndex", type: "uint256" },
            ],
            internalType: "struct IPortalsMulticall.Call[]",
            name: "calls",
            type: "tuple[]",
          },
        ],
        internalType: "struct IPortalsRouter.SignedOrderPayload",
        name: "signedOrderPayload",
        type: "tuple",
      },
      { internalType: "address", name: "partner", type: "address" },
    ],
    name: "portalWithSignature",
    outputs: [
      { internalType: "uint256", name: "outputAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "address",
                    name: "inputToken",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "inputAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "outputToken",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "minOutputAmount",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                  },
                ],
                internalType: "struct IPortalsRouter.Order",
                name: "order",
                type: "tuple",
              },
              { internalType: "bytes32", name: "routeHash", type: "bytes32" },
              { internalType: "address", name: "sender", type: "address" },
              { internalType: "uint64", name: "deadline", type: "uint64" },
              { internalType: "uint64", name: "nonce", type: "uint64" },
            ],
            internalType: "struct IPortalsRouter.SignedOrder",
            name: "signedOrder",
            type: "tuple",
          },
          { internalType: "bytes", name: "signature", type: "bytes" },
          {
            components: [
              { internalType: "address", name: "inputToken", type: "address" },
              { internalType: "address", name: "target", type: "address" },
              { internalType: "bytes", name: "data", type: "bytes" },
              { internalType: "uint256", name: "amountIndex", type: "uint256" },
            ],
            internalType: "struct IPortalsMulticall.Call[]",
            name: "calls",
            type: "tuple[]",
          },
        ],
        internalType: "struct IPortalsRouter.SignedOrderPayload",
        name: "signedOrderPayload",
        type: "tuple",
      },
      {
        components: [
          { internalType: "uint256", name: "amount", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "bytes", name: "signature", type: "bytes" },
          { internalType: "bool", name: "splitSignature", type: "bool" },
          { internalType: "bool", name: "daiPermit", type: "bool" },
        ],
        internalType: "struct IPortalsRouter.PermitPayload",
        name: "permitPayload",
        type: "tuple",
      },
      { internalType: "address", name: "partner", type: "address" },
    ],
    name: "portalWithSignatureAndPermit",
    outputs: [
      { internalType: "uint256", name: "outputAmount", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "tokenAddress", type: "address" },
      { internalType: "uint256", name: "tokenAmount", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "recoverToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
