import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class ZonePlacementGroup extends SxPrimitiveString {
  static override token = "group"
  static override parentToken = "placement"
  override token = "group"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZonePlacementGroup {
    if (
      primitiveSexprs.length !== 1 ||
      typeof primitiveSexprs[0] !== "string"
    ) {
      throw new Error("placement group requires one string source")
    }
    return new this(primitiveSexprs[0])
  }

  override getString(): string {
    return `(group ${quoteSExprString(this.value)})`
  }
}
SxClass.register(ZonePlacementGroup)
