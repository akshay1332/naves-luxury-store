import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a number as Indian Rupees
 * @param amount The amount to format
 * @param minimumFractionDigits Minimum number of decimal places (default: 2)
 * @returns Formatted string with ₹ symbol
 */
export const formatIndianPrice = (amount: number, minimumFractionDigits: number = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(amount);
};
