import { NextRequest, NextResponse } from 'next/server';
import { decodeAbiParameters, http } from "viem";
import { baseSepolia, morphHolesky } from "viem/chains";
import { spamProtectorAbi } from "../../../abi/spamProtectorAbi";
import { createPublicClient, createWalletClient } from "viem"; // Import necessary functions
import { privateKeyToAccount } from "viem/accounts";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from 'next';

const privateKey = process.env.PVT_KEY as `0x${string}`;


export type Call = {
    callTime: number;
    obfuscatedNumber: string;
    label: string,
    callType: number,
}


const submitCallsBaseSep = async (calls: Call[], submittedBy: `0x${string}`) => {
    const publicClient = createPublicClient({ chain: morphHolesky, transport: http("https://sepolia.base.org") });
    const account = privateKeyToAccount(privateKey);
    const accountClient = createWalletClient({
        chain: baseSepolia,
        account: account,
        transport: http("https://sepolia.base.org"),
    });

    const txHash = await accountClient.writeContract({
        address: "0xaA374f997005ddc7C1Dc8D8234ca79ffe5306347", // Replace with your contract address
        abi: spamProtectorAbi,
        functionName: "storeSpamOnlyOwner", // Replace with your function name
        args: [
            calls.map(call => [
                BigInt(call.callTime),
                call.obfuscatedNumber,
                call.label,
                BigInt(call.callType)
            ]),
            submittedBy
        ], // Add necessary arguments
    });

    console.log('base txHash', txHash);
}

const submitCallsMorph = async (calls: Call[], submittedBy: `0x${string}`) => {
    const publicClient = createPublicClient({ chain: morphHolesky, transport: http("https://rpc-quicknode-holesky.morphl2.io/") });
    const account = privateKeyToAccount(privateKey);
    const accountClient = createWalletClient({
        chain: morphHolesky,
        account: account,
        transport: http("https://rpc-quicknode-holesky.morphl2.io/"),
    });

    const txHash = await accountClient.writeContract({
        address: "0x23C8C02eFaf710a0E8ADe9431404FFdEdbD11B0C", // Replace with your contract address
        abi: spamProtectorAbi,
        functionName: "storeSpamOnlyOwner", // Replace with your function name
        args: [
            calls.map((call: Call) => [
                BigInt(call.callTime),
                call.obfuscatedNumber,
                call.label,
                BigInt(call.callType)
            ]),
            submittedBy
        ], // Add necessary arguments
    });

    console.log('morph txHash', txHash);
}

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { calls, submittedBy } = await req.json(); // Await the promise

    // Hash each obfuscatedNumber
    const hashedCalls = calls.map((call: Call) => ({
        ...call,
        obfuscatedNumber: crypto.createHash('sha256').update(call.obfuscatedNumber).digest('hex'),
    }));

    try {
        await submitCallsBaseSep(hashedCalls, submittedBy);
        await submitCallsMorph(hashedCalls, submittedBy);
        return NextResponse.json({ message: 'Calls submitted successfully' });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to submit calls' });
    }
}



