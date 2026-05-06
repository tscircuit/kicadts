import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintUnitName extends SxClass {
  static override token = "name"
  static override parentToken = "unit"
  override token = "name"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintUnitName {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("footprint unit name expects a string value")
    }
    return new FootprintUnitName(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(name ${quoteSExprString(this.value)})`
  }
}
SxClass.register(FootprintUnitName)
