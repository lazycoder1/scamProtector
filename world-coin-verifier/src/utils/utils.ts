import { encodePacked, isBytes, isHex, keccak256 } from "viem/utils"

export function hashToField(input: Uint8Array | string) {
    if (isBytes(input) || isHex(input)) return hashEncodedBytes(input)

    return hashString(input)
}

export function packAndEncode(input: [string, unknown][]) {
    const [types, values] = input.reduce<[string[], unknown[]]>(
        ([types, values], [type, value]) => {
            types.push(type)
            values.push(value)

            return [types, values]
        },
        [[], []]
    )

    return hashEncodedBytes(encodePacked(types, values))
}

/**
 * Converts an input to bytes and then hashes it with the World ID protocol hashing function.
 * @param input - String to hash
 * @returns hash
 */
function hashString(input: string) {
    const bytesInput = Buffer.from(input)

    return hashEncodedBytes(bytesInput)
}

/**
 * Hashes raw bytes input using the `keccak256` hashing function used across the World ID protocol, to be used as
 * a ZKP input. Example use cases include when you're hashing an address to be verified in a smart contract.
 * @param input - Bytes represented as a hex string.
 * @returns
 */
function hashEncodedBytes(input: `0x${string}` | Uint8Array) {
    const hash = BigInt(keccak256(input)) >> 8n
    const rawDigest = hash.toString(16)

    return { hash, digest: `0x${rawDigest.padStart(64, '0')}` }
}