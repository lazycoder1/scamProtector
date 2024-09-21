export const spamProtectorAbi = [
    {
        inputs: [
            {
                internalType: "contract IWorldID",
                name: "_worldId",
                type: "address",
            },
            {
                internalType: "string",
                name: "_appId",
                type: "string",
            },
            {
                internalType: "string",
                name: "_actionId",
                type: "string",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "nullifierHash",
                type: "uint256",
            },
        ],
        name: "DuplicateNullifier",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "callTime",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "obfuscatedNumber",
                type: "string",
            },
            {
                indexed: true,
                internalType: "address",
                name: "submittedBy",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "label",
                type: "string",
            },
            {
                indexed: false,
                internalType: "enum SpamCallReporter.CallType",
                name: "callType",
                type: "uint8",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "verified",
                type: "bool",
            },
        ],
        name: "FlaggedCall",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "root",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "nullifierHash",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256[8]",
                name: "proof",
                type: "uint256[8]",
            },
        ],
        name: "Proof",
        type: "event",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_owner",
                type: "address",
            },
        ],
        name: "changeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IWorldID",
                name: "_worldId",
                type: "address",
            },
            {
                internalType: "string",
                name: "_appId",
                type: "string",
            },
            {
                internalType: "string",
                name: "_actionId",
                type: "string",
            },
        ],
        name: "changeWorldCoinDetails",
        outputs: [],
        stateMutability: "nonpayable",
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
        name: "isVerified",
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
        name: "owner",
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
                components: [
                    {
                        internalType: "uint256",
                        name: "callTime",
                        type: "uint256",
                    },
                    {
                        internalType: "string",
                        name: "obfuscatedNumber",
                        type: "string",
                    },
                    {
                        internalType: "string",
                        name: "label",
                        type: "string",
                    },
                    {
                        internalType: "enum SpamCallReporter.CallType",
                        name: "callType",
                        type: "uint8",
                    },
                ],
                internalType: "struct SpamCallReporter.CallData[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "storeSpam",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "root",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "nullifierHash",
                type: "uint256",
            },
            {
                internalType: "uint256[8]",
                name: "proof",
                type: "uint256[8]",
            },
        ],
        name: "verifyUser",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "root",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "nullifierHash",
                type: "uint256",
            },
            {
                internalType: "uint256[8]",
                name: "proof",
                type: "uint256[8]",
            },
            {
                internalType: "address",
                name: "_verifiedAddress",
                type: "address",
            },
        ],
        name: "verifyUserByOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
