import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"

export class FootprintLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "footprint"
  token = "locked"

  constructor(value = true) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintLocked {
    if (primitiveSexprs.length === 0) {
      return new FootprintLocked(true)
    }

    const parsed = parseYesNo(primitiveSexprs[0])
    if (parsed === undefined) {
      throw new Error(
        `locked expects yes/no, received ${JSON.stringify(primitiveSexprs[0])}`,
      )
    }

    return new FootprintLocked(parsed)
  }
}
SxClass.register(FootprintLocked)
