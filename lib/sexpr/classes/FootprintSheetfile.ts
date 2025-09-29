import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintSheetfile extends SxClass {
  static override token = "sheetfile"
  static override parentToken = "footprint"
  override token = "sheetfile"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintSheetfile {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("sheetfile expects a string value")
    }
    return new FootprintSheetfile(value)
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
    return `(sheetfile ${quoteSExprString(this._value)})`
  }
}
SxClass.register(FootprintSheetfile)
