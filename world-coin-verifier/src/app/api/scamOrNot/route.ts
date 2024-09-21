import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const hashIt = (original: string) => {
    return crypto.createHash('sha256').update(original).digest('hex');
}


export const POST = async (req: NextRequest, res: NextResponse) => {
    const { number } = await req.json(); // Parse the incoming JSON request
    try {
        const result = await scamOrNott(number);
        return NextResponse.json({ success: true, result });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

const scamOrNott = async (number) => {
    console.log(hashIt(number));
    const flaggedCalls = await fetchFlaggedCalls(hashIt(number));
    if (flaggedCalls.length > 2) {
        return { scam: true, score: flaggedCalls.length };
    }
    else return { scam: false };
}

const fetchFlaggedCalls = async (obfuscatedNumber) => {
    const query = `
    query MyQuery { 
      flaggedCalls(
        first: 10
        where: {obfuscatedNumber: "${obfuscatedNumber}"}
      ) {
        blockNumber
        blockTimestamp
        callTime
        callType
        id
        label
        obfuscatedNumber
      }
    }`;

    const response = await fetch('https://api.studio.thegraph.com/query/24129/spamprotector-some-chain/version/latest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data.flaggedCalls;
}
