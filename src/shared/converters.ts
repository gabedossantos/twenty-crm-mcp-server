/**
 * Unit conversion utilities
 */

/**
 * Convert regular amount to micros (for GraphQL API)
 * Example: 1000 -> 1000000000
 */
export function toMicros(amount: number): number {
  return amount * 1000000;
}

/**
 * Convert micros back to regular amount (from GraphQL API)
 * Example: 1000000000 -> 1000
 */
export function fromMicros(amountMicros: number): number {
  return amountMicros / 1000000;
}

/**
 * Validate and normalize currency code
 */
export function normalizeCurrencyCode(code?: string): string {
  return (code || "USD").toUpperCase();
}

/**
 * Check if a value is a valid amount
 */
export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === "number" && !isNaN(amount) && amount >= 0;
}
