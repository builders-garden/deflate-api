export const DEFLATE_PORTAL_ABI = [
    [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_usdcAddress",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "_routerAddress",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "_supportedTokens",
              "type": "address[]"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "AlreadyInitialized",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "txData",
              "type": "bytes"
            }
          ],
          "name": "executeStrategy",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "routerAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "routerFunctionSelector",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "",
              "type": "bytes4"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "supportedTokens",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "usdcTokenAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes",
              "name": "txData",
              "type": "bytes"
            }
          ],
          "name": "validatePortalCalldata",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "stateMutability": "payable",
          "type": "receive"
        }
      ],
] as const;