import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class SymbolExtends extends SxPrimitiveString {
  static override token = "extends"
  static override parentToken = "symbol"
  override token = "extends"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolExtends {
    const [parentSymbolPrimitive, ...unexpectedPrimitives] = primitiveSexprs
    const parentSymbolName = toStringValue(parentSymbolPrimitive)
    if (parentSymbolName === undefined || unexpectedPrimitives.length > 0) {
      throw new Error("extends expects a single parent symbol name")
    }
    return new SymbolExtends(parentSymbolName)
  }

  override getString(): string {
    return `(extends ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SymbolExtends)
