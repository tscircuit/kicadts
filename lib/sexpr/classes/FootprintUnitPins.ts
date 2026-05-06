import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintUnitPins extends SxClass {
  static override token = "pins"
  static override parentToken = "unit"
  override token = "pins"

  values: string[]

  constructor(values: string[] = []) {
    super()
    this.values = values
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnitPins {
    const values = primitiveSexprs.map((primitive) => {
      const value = toStringValue(primitive)
      if (value === undefined) {
        throw new Error("footprint unit pins expects string values")
      }
      return value
    })
    return new FootprintUnitPins(values)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(pins ${this.values.map((value) => quoteSExprString(value)).join(" ")})`
  }
}
SxClass.register(FootprintUnitPins)
