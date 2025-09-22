import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Stroke } from "../classes/Stroke"

export const strokeFromArgs = (
  args: PrimitiveSExpr[],
): Stroke | undefined => {
  try {
    const parsed = SxClass.parsePrimitiveSexpr(
      ["stroke", ...args] as PrimitiveSExpr,
    )
    if (parsed instanceof Stroke) {
      return parsed
    }
  } catch {
    // Ignore parse errors and defer to caller
  }
  return undefined
}
