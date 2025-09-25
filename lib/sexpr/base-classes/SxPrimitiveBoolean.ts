import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "./SxClass"

export abstract class SxPrimitiveBoolean extends SxClass {
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
    const [rawVal] = primitiveSexprs
    let booleanVal: boolean
    if (typeof rawVal === "boolean") {
      booleanVal = rawVal
    } else if (typeof rawVal === "string") {
      booleanVal = rawVal === "true" || rawVal === "yes"
    } else {
      booleanVal = false
    }
    // @ts-ignore
    return new this(rawVal as boolean)
  }

  override getString() {
    return `(${this.token} ${this.value ? "yes" : "no"})`
  }
}
