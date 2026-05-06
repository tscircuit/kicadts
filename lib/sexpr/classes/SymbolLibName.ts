import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class SymbolLibName extends SxPrimitiveString {
  static override token = "lib_name"
  static override parentToken = "symbol"
  override token = "lib_name"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolLibName {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("lib_name expects a string value")
    }
    return new SymbolLibName(value)
  }

  override getString(): string {
    return `(lib_name ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SymbolLibName)
