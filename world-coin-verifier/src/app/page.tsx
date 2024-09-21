"use client";
import React from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";

const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
const action = process.env.NEXT_PUBLIC_ACTION as string;

// TODO: Calls your implemented server route
const verifyProof = async (proof: any) => {
    const response = await fetch("/api/verifyAndUpdate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            proof: proof,
            verifiedAddress: "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5",
            signal: "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5",
        }),
    });

    const onChainResponse = await fetch("/api/onchainVerify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            proof: proof,
            verifiedAddress: "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5",
            siganl: "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5",
        }),
    });

    console.log(onChainResponse);

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Error verifying proof:", errorData.error);
        return;
    }

    const data = await response.json();
    console.log("Verification result:", data.result);
};

export default function Home() {
    // TODO: Functionality after verifying
    const onSuccess = () => {
        console.log("Success");
    };

    // New function to call the API with dummy data
    const submitDummyData = async () => {
        const dummyCalls = [
            { obfuscatedNumber: "1234567890", callTime: 1726947975098, label: "HDBC", callType: 0 },
            { obfuscatedNumber: "0987654321", callTime: 1726947975098, label: "AX1S", callType: 0 },
        ];
        const submittedBy = "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5";

        const response = await fetch("/api/submitCalls", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ calls: dummyCalls, submittedBy }),
        });

        const result = await response.json();
        console.log(result);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <IDKitWidget
                    app_id={app_id}
                    action={action}
                    // On-chain only accepts Orb verifications
                    verification_level={VerificationLevel.Orb}
                    // @ts-ignore
                    signal={"0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5"}
                    handleVerify={verifyProof}
                    onSuccess={onSuccess}
                >
                    {({ open }) => <button onClick={open}>Verify with World ID</button>}
                </IDKitWidget>
                {/* Button to submit dummy data */}
                <button onClick={submitDummyData}>Submit Dummy Data</button>
            </main>
        </div>
    );
}
