/**
 * Check if a string needs to be quoted in S-expression format.
 * Strings need quoting if they contain special characters like spaces, parentheses, quotes, etc.
 */
export const needsQuoting = (value: string): boolean => {
  // Empty strings need quotes
  if (value.length === 0) return true

  // Check for special characters that require quoting
  return /[\s()"\\]/.test(value)
}

/**
 * Quote a string for S-expression format with proper escaping
 */
export const quoteSExprString = (value: string): string => {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")}"`
}

/**
 * Quote a string only if necessary (contains special characters)
 */
export const quoteIfNeeded = (value: string): string => {
  return needsQuoting(value) ? quoteSExprString(value) : value
}
