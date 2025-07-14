import { fromBech32 } from "@cosmjs/encoding";
import { bech32 } from "bech32";

export function toCanonical(bech32Address: string): string {
  const { data: canonicalBytes } = fromBech32(bech32Address);

  // Convert Uint8Array to hex string manually
  const canonicalHex = Array.from(canonicalBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return "0x" + canonicalHex;
}

export function isValidCosmosAddress(address: string): boolean {
  const prefixes = [
    "osmo",
    "xion",
    "union",
    "stride",
    "stars",
    "celestia",
    "bbn",
    "cosmos",
    "juno",
    "sei",
  ];

  try {
    const { prefix, words } = bech32.decode(address);

    // Ensure prefix is one of the expected prefixes
    if (!prefixes.includes(prefix)) return false;

    // Convert to bytes to check validity
    const bytes = bech32.fromWords(words);

    // Cosmos addresses are typically 20 bytes
    return bytes.length === 20;
  } catch (e) {
    return false; // Invalid Bech32 encoding
  }
}
export function isValidEvmAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
