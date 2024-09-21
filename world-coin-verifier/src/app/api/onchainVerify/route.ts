import { NextResponse } from 'next/server';
import { decodeAbiParameters, http } from "viem";
import { baseSepolia, morphHolesky } from "viem/chains";
import { spamProtectorAbi } from "../../../abi/spamProtectorAbi";
import { createPublicClient, createWalletClient } from "viem"; // Import necessary functions
import { privateKeyToAccount } from "viem/accounts";
import { hashToField } from '@worldcoin/idkit-core/hashing';

export type Proof = {
    proof: `0x${string}`;
    merkle_root: `0x${string}`;
    nullifier_hash: `0x${string}`;
    verification_level?: `string`;
};

export type VerifyArgs = {
    proof: Proof;
    verifiedAddress: `0x${string}`;
    signal: `0x${string}`
};

export async function POST(request: Request) {
    const verifyArgs = await request.json(); // Parse the incoming JSON request
    try {
        const result = await verifyAndUpdate(verifyArgs);
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

const unpackedProof = (proof: `0x${string}`) => decodeAbiParameters([{ type: "uint256[8]" }], proof)[0];
const privateKey = process.env.PVT_KEY as `0x${string}`;

// Create clients for the Morph Helesky network
const publicClient = createPublicClient({ chain: morphHolesky, transport: http("https://sepolia.base.org") });
const account = privateKeyToAccount(privateKey);
const accountClient = createWalletClient({
    chain: baseSepolia,
    account: account,
    transport: http("https://sepolia.base.org"),
});

export async function verifyAndUpdate(verifyArgs: VerifyArgs) {
    console.log('here');
    if (await verifyWithWorldCoin(verifyArgs)) return await updateBlockchain(verifyArgs);
    else throw new Error("Verification failed");
}

export async function updateBlockchain(verifyArgs: VerifyArgs) {
    // Example contract interaction
    const worldCoinProof = verifyArgs.proof;
    const txHash = await accountClient.writeContract({
        address: "0xaA374f997005ddc7C1Dc8D8234ca79ffe5306347", // Replace with your contract address
        abi: spamProtectorAbi,
        functionName: "verifyUser", // Replace with your function name
        args: [
            BigInt(worldCoinProof!.merkle_root),
            BigInt(worldCoinProof!.nullifier_hash),
            unpackedProof(worldCoinProof!.proof),
            verifyArgs!.verifiedAddress,
        ], // Add necessary arguments
    });
    console.log("Transaction Hash:", txHash);
    return txHash;
}

async function verifyWithWorldCoin(verifyArgs: VerifyArgs) {
    console.log('here2');
    const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
    const action = process.env.NEXT_PUBLIC_ACTION as string;
    console.log(JSON.stringify({
        nullifier_hash: verifyArgs.proof.nullifier_hash,
        merkle_root: verifyArgs.proof.merkle_root,
        proof: verifyArgs.proof.proof,
        verification_level: verifyArgs.proof.verification_level || 'default_level', // Use a default if not provided
        action: action,
        signal: verifyArgs.signal ?? hashToField(verifyArgs.signal)
    }))

    const apiUrl = 'https://developer.worldcoin.org' + `/api/v2/verify/${app_id}`; // Replace with your actual API URL
    const verifyRes = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nullifier_hash: verifyArgs.proof.nullifier_hash,
            merkle_root: verifyArgs.proof.merkle_root,
            proof: verifyArgs.proof.proof,
            verification_level: verifyArgs.proof.verification_level || 'default_level', // Use a default if not provided
            action: action,
            signal: verifyArgs.signal ?? hashToField(verifyArgs.signal)
        }),
    }).then(response => response.json()); // Parse the JSON response

    console.log('here5', verifyRes);

    if (verifyRes.success) {
        return true;
    } else {
        return false;
    }
}
