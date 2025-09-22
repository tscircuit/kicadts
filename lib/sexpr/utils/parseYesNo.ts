import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "./toStringValue"

export const parseYesNo = (
  value: PrimitiveSExpr | undefined,
): boolean | undefined => {
  const str = toStringValue(value)
  if (!str) return undefined
  if (str === "yes" || str === "true") return true
  if (str === "no" || str === "false") return false
  return undefined
}
