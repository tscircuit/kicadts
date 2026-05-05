import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"

export class FootprintUnitPins extends SxClass {
  static override token = "pins"
  static override parentToken = "unit"
  token = "pins"
  values: string[]

  constructor(values: string[]) {
    super()
    this.values = values
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnitPins {
    const values = primitiveSexprs
      .map((p) => toStringValue(p))
      .filter((v): v is string => v !== undefined)
    return new FootprintUnitPins(values)
  }

  override getString() {
    return `(pins ${this.values.map((v) => quoteSExprString(v)).join(" ")})`
  }
}
SxClass.register(FootprintUnitPins)
