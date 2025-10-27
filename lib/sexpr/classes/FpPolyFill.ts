import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxClass } from "../base-classes/SxClass"

const truthyStrings = new Set(["yes", "true", "1", "solid"])

export class FpPolyFill extends SxClass {
  static override token = "fill"
  static override parentToken = "fp_poly"
  override token = "fill"

  value: string

  constructor(value: string | boolean) {
    super()
    if (typeof value === "boolean") {
      this.value = value ? "yes" : "no"
    } else {
      this.value = value
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpPolyFill {
    const [rawValue] = primitiveSexprs

    if (rawValue === undefined) {
      return new FpPolyFill("no")
    }

    if (typeof rawValue === "boolean") {
      return new FpPolyFill(rawValue)
    }

    if (typeof rawValue === "string") {
      return new FpPolyFill(rawValue)
    }

    return new FpPolyFill("no")
  }

  get filled(): boolean {
    return truthyStrings.has(this.value.toLowerCase())
  }

  set filled(filled: boolean) {
    this.value = filled ? "yes" : "no"
  }

  override getString(): string {
    return `(fill ${this.value})`
  }
}
SxClass.register(FpPolyFill)
