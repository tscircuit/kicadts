import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "./SxClass"

export abstract class SxPrimitiveBoolean extends SxClass {
  value: boolean

  constructor(v: boolean) {
    super()
    this.value = v
  }

  set(value: boolean) {
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SxPrimitiveBoolean {
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
    return new this(booleanVal)
  }

  override getString() {
    return `(${this.token} ${this.value ? "yes" : "no"})`
  }
}
