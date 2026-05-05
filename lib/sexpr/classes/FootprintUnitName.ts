import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"

export class FootprintUnitName extends SxClass {
  static override token = "name"
  static override parentToken = "unit"
  token = "name"
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnitName {
    const val = toStringValue(primitiveSexprs[0])
    if (val === undefined) {
      throw new Error("Footprint unit name expects a string value")
    }
    return new FootprintUnitName(val)
  }

  override getString() {
    return `(name ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintUnitName)
