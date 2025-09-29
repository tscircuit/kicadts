import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "../base-classes/SxClass"

const truthyStrings = new Set(["yes", "true", "1"])

export class FpPolyLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "fp_poly"
  override token = "locked"

  constructor(value: boolean) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpPolyLocked {
    const [rawValue] = primitiveSexprs

    if (rawValue === undefined) {
      return new FpPolyLocked(true)
    }

    if (typeof rawValue === "boolean") {
      return new FpPolyLocked(rawValue)
    }

    if (typeof rawValue === "string") {
      return new FpPolyLocked(truthyStrings.has(rawValue.toLowerCase()))
    }

    return new FpPolyLocked(false)
  }

  override getString(): string {
    return `(locked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(FpPolyLocked)
