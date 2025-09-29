import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"
import { toStringValue } from "../utils/toStringValue"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class FootprintTedit extends SxPrimitiveString {
  static override token = "tedit"
  static override parentToken = "footprint"
  token = "tedit"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTedit {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("tedit expects a string value")
    }
    return new FootprintTedit(value)
  }
}
SxClass.register(FootprintTedit)
