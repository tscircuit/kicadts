import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export const toNumberValue = (
  value: PrimitiveSExpr | undefined,
): number | undefined => {
  if (value === undefined) return undefined
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }
  return undefined
}
