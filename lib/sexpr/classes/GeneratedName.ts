import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class GeneratedName extends SxClass {
  static override token = "name"
  static override parentToken = "generated"
  token = "name"
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedName {
    const val = toStringValue(primitiveSexprs[0])
    if (val === undefined) {
      throw new Error("generated name expects a string value")
    }
    return new GeneratedName(val)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(name ${quoteSExprString(this.value)})`
  }
}
SxClass.register(GeneratedName)
