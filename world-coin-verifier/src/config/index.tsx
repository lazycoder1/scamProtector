import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
    throw new Error("Project ID is not defined");
}

export const lineaTestnet = {
    id: "eip155:59141" as `eip155:${number}`, // Explicitly typing id
    chainId: 59141,
    name: "Linea",
    currency: "ETH",
    explorerUrl: "https://sepolia.lineascan.build/",
    rpcUrl: "https://rpc.sepolia.linea.build",
    chainNamespace: "eip155" as const, // Ensure it's a specific string literal type
} as const;

export const morphl2 = {
    // morph bicnomy has support for mainnet only
    id: "eip155:2810" as `eip155:${number}`, // Explicitly typing id
    chainId: 2810,
    name: "Morph Hol",
    currency: "ETH",
    explorerUrl: "https://explorer-holesky.morphl2.io/",
    rpcUrl: "https://rpc-holesky.morphl2.io",
    chainNamespace: "eip155" as const, // Ensure it's a specific string literal type
} as const;

export const baseSep = {
    id: "eip155:84532" as `eip155:${number}`, // Explicitly typing id
    chainId: 84532,
    name: "Base Sep",
    currency: "ETH",
    explorerUrl: "https://sepolia.basescan.org/",
    rpcUrl: "https://base-sepolia.gateway.tenderly.co", // change to rpc from base developer platform
    chainNamespace: "eip155" as const, // Ensure it's a specific string literal type
};

export const networks = [mainnet, lineaTestnet, morphl2, baseSep];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage,
    }),
    ssr: true,
    projectId,
    networks,
});

export const config = wagmiAdapter.wagmiConfig;
