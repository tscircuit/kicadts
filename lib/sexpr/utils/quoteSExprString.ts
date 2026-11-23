const NUMERIC_LITERAL_REGEX = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u

/**
 * Check if a string needs to be quoted in S-expression format.
 * Strings need quoting if they are empty, contain special characters, start
 * with a comment delimiter, or would otherwise tokenize as a non-string
 * literal (number, boolean, or nil).
 */
export const needsQuoting = (value: string): boolean => {
  // Empty strings need quotes
  if (value.length === 0) return true

  // Reserved non-string S-expression literals
  if (value === "#t" || value === "#f" || value === "nil") return true

  // Leading ';' starts an S-expression line comment
  if (value.startsWith(";")) return true

  // Numeric-looking strings would re-parse as numbers if emitted bare
  if (NUMERIC_LITERAL_REGEX.test(value)) return true

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
