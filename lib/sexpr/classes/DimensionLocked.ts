import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"

export class DimensionLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "dimension"
  token = "locked"

  constructor(value = true) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): DimensionLocked {
    if (primitiveSexprs.length === 0) {
      return new DimensionLocked(true)
    }

    const parsed = parseYesNo(primitiveSexprs[0])
    if (parsed === undefined) {
      throw new Error(
        `dimension locked expects yes/no, received ${JSON.stringify(primitiveSexprs[0])}`,
      )
    }

    return new DimensionLocked(parsed)
  }
}
SxClass.register(DimensionLocked)
