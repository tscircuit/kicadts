import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "./SxClass"

export abstract class SxPrimitiveNumber extends SxClass {
  value: number

  constructor(v: number) {
    super()
    this.value = v
  }

  set(value: number) {
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SxPrimitiveNumber {
    // @ts-ignore
    return new this(primitiveSexprs[0] as number)
  }

  override getString() {
    return `(${this.token} ${this.value})`
  }
}
