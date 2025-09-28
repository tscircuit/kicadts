import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

const truthyStrings = new Set(["true", "yes", "1"])

export class GrLineLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "gr_line"
  override token = "locked"

  constructor(value: boolean) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrLineLocked {
    const [rawValue] = primitiveSexprs

    if (rawValue === undefined) {
      return new GrLineLocked(true)
    }

    if (typeof rawValue === "boolean") {
      return new GrLineLocked(rawValue)
    }

    if (typeof rawValue === "string") {
      return new GrLineLocked(truthyStrings.has(rawValue.toLowerCase()))
    }

    return new GrLineLocked(false)
  }

  override getString(): string {
    return `(locked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(GrLineLocked)
