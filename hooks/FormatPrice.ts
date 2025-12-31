/**
 * Format number to IDR format (Indonesian Rupiah)
 * Example: 10000 -> "10.000"
 * @param value - The number to format
 * @returns Formatted string with dot as thousand separator
 */
export function formatIDR(value: number | string): string {
  // Handle empty or invalid values
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  // Convert to string and remove any existing formatting
  const numStr = String(value).replace(/\./g, "");

  // Parse to number to ensure it's valid
  const num = Number(numStr);

  // Return empty string if not a valid number
  if (isNaN(num)) {
    return "";
  }

  // Return "0" for zero value
  if (num === 0) {
    return "0";
  }

  // Format with dot as thousand separator
  return num.toLocaleString("id-ID");
}

/**
 * Parse IDR formatted string back to number
 * Example: "10.000" -> 10000
 * @param value - The formatted string to parse
 * @returns The numeric value
 */
export function parseIDR(value: string): number {
  // Remove all dots (thousand separators)
  const cleaned = value.replace(/\./g, "");

  // Parse to number
  const num = Number(cleaned);

  // Return 0 if not a valid number
  return isNaN(num) ? 0 : num;
}
