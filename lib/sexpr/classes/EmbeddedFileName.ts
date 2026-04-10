import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class EmbeddedFileName extends SxClass {
  static override token = "name"
  static override parentToken = "file"
  token = "name"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFileName {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("file name expects a string value")
    }
    return new EmbeddedFileName(value)
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
    return `(name ${quoteSExprString(this._value)})`
  }
}
SxClass.register(EmbeddedFileName)
