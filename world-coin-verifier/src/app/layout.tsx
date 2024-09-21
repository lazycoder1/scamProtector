import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { headers } from "next/headers"; // added

export const metadata: Metadata = {
    title: "Spam Protector Sample App",
    description: "Powered by WalletConnect",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookies = headers().get("cookie");

    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
