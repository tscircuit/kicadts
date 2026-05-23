import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"

export class ZoneLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "zone"
  override token = "locked"

  constructor(value: boolean) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneLocked {
    if (primitiveSexprs.length === 0) {
      return new ZoneLocked(true)
    }

    return new ZoneLocked(parseYesNo(primitiveSexprs[0]) ?? false)
  }

  override getString(): string {
    return `(locked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(ZoneLocked)
