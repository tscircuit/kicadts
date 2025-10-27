import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "./SxClass"
import { quoteIfNeeded } from "../utils/quoteSExprString"

export abstract class SxPrimitiveString extends SxClass {
  value: string

  constructor(v: string) {
    super()
    this.value = v
  }

  set(value: string) {
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SxPrimitiveString {
    // @ts-ignore
    return new this(primitiveSexprs[0] as string)
  }

  override getString() {
    return `(${this.token} ${quoteIfNeeded(this.value)})`
  }
}
