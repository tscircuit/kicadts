import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

const truthyStrings = new Set(["true", "yes", "1"])

export class GrArcLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "gr_arc"
  override token = "locked"

  constructor(value: boolean) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArcLocked {
    const [rawValue] = primitiveSexprs

    if (rawValue === undefined) {
      return new GrArcLocked(true)
    }

    if (typeof rawValue === "boolean") {
      return new GrArcLocked(rawValue)
    }

    if (typeof rawValue === "string") {
      return new GrArcLocked(truthyStrings.has(rawValue.toLowerCase()))
    }

    return new GrArcLocked(false)
  }

  override getString(): string {
    return `(locked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(GrArcLocked)
