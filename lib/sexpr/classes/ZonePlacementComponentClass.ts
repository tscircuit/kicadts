import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class ZonePlacementComponentClass extends SxPrimitiveString {
  static override token = "component_class"
  static override parentToken = "placement"
  override token = "component_class"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZonePlacementComponentClass {
    if (
      primitiveSexprs.length !== 1 ||
      typeof primitiveSexprs[0] !== "string"
    ) {
      throw new Error("placement component_class requires one string source")
    }
    return new this(primitiveSexprs[0])
  }

  override getString(): string {
    return `(component_class ${quoteSExprString(this.value)})`
  }
}
SxClass.register(ZonePlacementComponentClass)
