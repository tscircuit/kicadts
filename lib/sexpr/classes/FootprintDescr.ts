import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintDescr extends SxClass {
  static override token = "descr"
  static override parentToken = "footprint"
  token = "descr"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintDescr {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("descr expects a string value")
    }
    return new FootprintDescr(value)
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
    return `(descr ${quoteSExprString(this._value)})`
  }
}
SxClass.register(FootprintDescr)
