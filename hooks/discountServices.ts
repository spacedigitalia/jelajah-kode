/**
 * Discount Services
 * Utility functions and hooks for handling discount calculations and expiration checks
 */

export interface Discount {
  type: "percentage" | "fixed";
  value: number;
  until?: string;
}

/**
 * Check if discount is expired based on the until date
 * @param discount - The discount object to check
 * @returns true if discount is expired, false otherwise
 */
export function isDiscountExpired(discount?: Discount): boolean {
  if (!discount || !discount.until) return false;

  const today = new Date();
  const expiryDate = new Date(discount.until);

  // Set time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  return today > expiryDate;
}

/**
 * Calculate the discounted price based on discount type
 * @param price - Original price
 * @param discount - Discount object (optional)
 * @returns The price after discount is applied
 */
export function calculateDiscountedPrice(
  price: number,
  discount?: Discount
): number {
  if (!discount) return price;

  if (discount.type === "percentage") {
    return price * (1 - discount.value / 100);
  } else {
    // Fixed discount
    return Math.max(0, price - discount.value);
  }
}

/**
 * Get active discount (only if not expired)
 * @param discount - Discount object to check
 * @returns Active discount if not expired, undefined otherwise
 */
export function getActiveDiscount(discount?: Discount): Discount | undefined {
  if (!discount) return undefined;
  return isDiscountExpired(discount) ? undefined : discount;
}

/**
 * Hook to get discount-related calculations
 * @param price - Original price
 * @param discount - Discount object (optional)
 * @returns Object containing discount calculations and status
 */
export function useDiscount(price: number, discount?: Discount) {
  const discountExpired = isDiscountExpired(discount);
  const activeDiscount = getActiveDiscount(discount);
  const discountedPrice = activeDiscount
    ? calculateDiscountedPrice(price, activeDiscount)
    : price;

  return {
    originalPrice: price,
    discountedPrice,
    activeDiscount,
    discountExpired,
    hasDiscount: !!discount,
    hasActiveDiscount: !!activeDiscount,
  };
}
