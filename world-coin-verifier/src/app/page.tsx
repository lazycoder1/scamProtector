"use client";
import React from "react";

const app_id = process.env.NEXT_PUBLIC_APP_ID as `app_${string}`;
const action = process.env.NEXT_PUBLIC_ACTION as string;

export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <button className="bg-white text-black rounded-lg p-2">Worldcoin verify</button>
            </main>
        </div>
    );
}
