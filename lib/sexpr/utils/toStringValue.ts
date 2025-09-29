import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export const toStringValue = (
  value: PrimitiveSExpr | undefined,
): string | undefined => {
  if (value === undefined) return undefined
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean")
    return String(value)
  return undefined
}
