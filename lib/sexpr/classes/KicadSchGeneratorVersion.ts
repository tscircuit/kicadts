import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class KicadSchGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "kicad_sch"
  override token = "generator_version"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSchGeneratorVersion {
    const [rawValue] = primitiveSexprs
    const parsedValue = toStringValue(rawValue)
    if (parsedValue === undefined) {
      throw new Error("generator_version expects a string argument")
    }
    return new KicadSchGeneratorVersion(parsedValue)
  }

  override getString(): string {
    return `(generator_version ${quoteIfNeeded(this.value)})`
  }
}
SxClass.register(KicadSchGeneratorVersion)
