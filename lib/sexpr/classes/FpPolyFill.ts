import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "../base-classes/SxClass"

const truthyStrings = new Set(["yes", "true", "1"])

export class FpPolyFill extends SxPrimitiveBoolean {
  static override token = "fill"
  static override parentToken = "fp_poly"
  override token = "fill"

  constructor(filled: boolean) {
    super(filled)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpPolyFill {
    const [rawValue] = primitiveSexprs

    if (rawValue === undefined) {
      return new FpPolyFill(false)
    }

    if (typeof rawValue === "boolean") {
      return new FpPolyFill(rawValue)
    }

    if (typeof rawValue === "string") {
      return new FpPolyFill(truthyStrings.has(rawValue.toLowerCase()))
    }

    return new FpPolyFill(false)
  }

  get filled(): boolean {
    return this.value
  }

  set filled(filled: boolean) {
    this.value = filled
  }

  override getString(): string {
    return `(fill ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(FpPolyFill)
