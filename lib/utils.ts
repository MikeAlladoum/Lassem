/**
 * Utility function to combine classNames
 * @param classes - Classes to combine
 * @returns Combined class string
 */
export function cn(...classes: (string | undefined | boolean | null)[]): string {
  return classes
    .filter((className) => Boolean(className) && typeof className === "string")
    .join(" ");
}
