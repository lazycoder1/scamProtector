"use client";
import React, { useEffect, useState } from "react"; // Add useState import
import { useLocation } from "react-router-dom";
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

    const onChainResponse = await fetch("/api/onchainVerify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            proof: proof,
            verifiedAddress: "0x4D0b9B12fF3C0f6aA72C6800c309585A343f3bB5",
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
    const [address, setAddress] = useState("");
    const [proof, setProof] = useState<any>(null);
    const [close, setClose] = useState(false);
    const [isWidgetVisible, setWidgetVisible] = useState(false); // New state to control visibility

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const addressFromQuery = queryParams.get("address");
        if (addressFromQuery) {
            setAddress(addressFromQuery);
        }
    }, []);

    useEffect(() => {
        setWidgetVisible(true);
    }, [address]);

    useEffect(() => {
        if (close) {
            closeWebview(proof);
        }
    }, [proof, close]);

    useEffect(() => {
        const messageHandler = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log("Data from React Native:", data);
        };

        // Add event listener
        window.addEventListener("message", messageHandler);

        return () => {
            // Remove the same event listener
            window.removeEventListener("message", messageHandler);
        };
    }, []);

    const closeWebview = (proof: any) => {
        // Perform necessary operations and return result
        const response = { status: true, proof: proof };
        //@ts-ignore
        window.ReactNativeWebView.postMessage(JSON.stringify(response));
    };

    // TODO: Functionality after verifying
    const onSuccess = () => {
        console.log("Success");

        setClose(true);
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

    const saveAndTriggerVerification = (proof: any) => {
        setProof(proof);
        verifyProof(proof);
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {isWidgetVisible && ( // Conditional rendering based on state
                    <IDKitWidget
                        app_id={app_id}
                        action={action}
                        // On-chain only accepts Orb verifications
                        verification_level={VerificationLevel.Orb}
                        // @ts-ignore
                        handleVerify={saveAndTriggerVerification}
                        onSuccess={onSuccess}
                    >
                        {/* @ts-ignore */}
                        {({ open }) => <button onClick={open}>Verify with World ID</button>}
                    </IDKitWidget>
                )}
                {/* Button to submit dummy data */}
                <button onClick={submitDummyData}>Submit Dummy Data</button>
                {/* Button to show the widget */}
                <button>Address: {address}</button>
                <button
                    onClick={() =>
                        closeWebview({
                            uses: 1,
                            success: true,
                            action: "who",
                            max_uses: 1,
                            nullifier_hash: "0x133106bae4e8c22fcc8bae9e8b8e7d9ffbb3b957b6415824d30fde60cba99255",
                            created_at: "2024-09-21T21:40:30.003252+00:00",
                            verification_level: "orb",
                        })
                    }
                >
                    test
                </button>
            </main>
        </div>
    );
}
