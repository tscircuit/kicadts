/**
 * Check if a string needs to be quoted in S-expression format.
 * Strings need quoting if they contain special characters like spaces, parentheses, quotes, etc.
 */
export const needsQuoting = (value: string): boolean => {
  // Empty strings need quotes
  if (value.length === 0) return true

  // Check for special characters that require quoting
  if (/[\s()"\\]/.test(value)) return true

  // A leading ";" starts a comment, so a bare token beginning with one swallows the rest
  // of the line and the document no longer parses.
  if (value.startsWith(";")) return true

  // The lexer reads these bare tokens as literals rather than strings, so emitting them
  // bare changes the value's type on the next parse.
  if (value === "nil" || value === "#t" || value === "#f") return true

  // A bare token that reads back as a number is likewise a different value:
  // (generator_version 10.99) round-trips into the number 10.99, not the string "10.99".
  return /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(value)
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
