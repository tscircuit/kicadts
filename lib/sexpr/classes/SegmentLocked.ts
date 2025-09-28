import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

const truthyStrings = new Set(["true", "yes", "1"])

export class SegmentLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "segment"
  override token = "locked"

  constructor(value: boolean) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SegmentLocked {
    const [rawValue] = primitiveSexprs
    if (typeof rawValue === "boolean") {
      return new SegmentLocked(rawValue)
    }
    if (typeof rawValue === "string") {
      return new SegmentLocked(truthyStrings.has(rawValue.toLowerCase()))
    }
    return new SegmentLocked(false)
  }

  override getString(): string {
    return `(locked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(SegmentLocked)
