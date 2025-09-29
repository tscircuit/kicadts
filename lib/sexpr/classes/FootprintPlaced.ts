import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"

export class FootprintPlaced extends SxPrimitiveBoolean {
  static override token = "placed"
  static override parentToken = "footprint"
  token = "placed"

  constructor(value = true) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintPlaced {
    if (primitiveSexprs.length === 0) {
      return new FootprintPlaced(true)
    }

    const parsed = parseYesNo(primitiveSexprs[0])
    if (parsed === undefined) {
      throw new Error(
        `placed expects yes/no, received ${JSON.stringify(primitiveSexprs[0])}`,
      )
    }

    return new FootprintPlaced(parsed)
  }
}
SxClass.register(FootprintPlaced)
