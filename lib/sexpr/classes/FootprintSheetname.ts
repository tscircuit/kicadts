import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintSheetname extends SxClass {
  static override token = "sheetname"
  static override parentToken = "footprint"
  override token = "sheetname"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintSheetname {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("sheetname expects a string value")
    }
    return new FootprintSheetname(value)
  }

  get value(): string {
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(sheetname ${quoteSExprString(this._value)})`
  }
}
SxClass.register(FootprintSheetname)
