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
        }),
    });

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
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <IDKitWidget
                    app_id={app_id}
                    action={action}
                    // On-chain only accepts Orb verifications
                    verification_level={VerificationLevel.Device}
                    // @ts-ignore
                    handleVerify={verifyProof}
                    onSuccess={onSuccess}
                >
                    {({ open }) => <button onClick={open}>Verify with World ID</button>}
                </IDKitWidget>
            </main>
        </div>
    );
}
