import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintTags extends SxClass {
  static override token = "tags"
  static override parentToken = "footprint"
  token = "tags"

  private _value: string

  constructor(value: string) {
    super()
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintTags {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("tags expects a string value")
    }
    return new FootprintTags(value)
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
    return `(tags ${quoteSExprString(this._value)})`
  }
}
SxClass.register(FootprintTags)
