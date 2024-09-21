import { NextRequest, NextResponse } from 'next/server';
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

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { address } = await req.json(); // Parse the incoming JSON request
    try {
        const result = await checkAddressVerification(address)
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

const privateKey = process.env.PVT_KEY as `0x${string}`;

// Create clients for the Morph Helesky network
const publicClient = createPublicClient({ chain: morphHolesky, transport: http("https://rpc-quicknode-holesky.morphl2.io/") });
const account = privateKeyToAccount(privateKey);

const checkAddressVerification = async (address: `0x${string}`) => { // not needed API 
    const res = await publicClient.readContract({
        address: "0xEb3F4D20d9295B49EEa32da1F72A735aBf8576BA", // Replace with your contract address
        abi: spamProtectorAbi,
        functionName: "isVerified",
        args: [address]
    })
    console.log(res);
    return res;
}