import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class EmbeddedFileType extends SxClass {
  static override token = "type"
  static override parentToken = "file"
  token = "type"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFileType {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("file type expects a string value")
    }
    return new EmbeddedFileType(value)
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
    return `(type ${quoteSExprString(this._value)})`
  }
}
SxClass.register(EmbeddedFileType)
