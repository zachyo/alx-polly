import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges CSS class names.
 *
 * This function is a utility that wraps `clsx` and `tailwind-merge`.
 * `clsx` allows for conditionally applying class names, and `tailwind-merge`
 * intelligently merges Tailwind CSS classes, resolving conflicts.
 *
 * @param {...ClassValue[]} inputs - A list of class values to combine.
 *   These can be strings, arrays, or objects with boolean values.
 * @returns {string} The merged and optimized class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
