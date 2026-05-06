import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class KicadSymbolLibGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "kicad_symbol_lib"
  override token = "generator_version"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSymbolLibGeneratorVersion {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("generator_version expects a string argument")
    }
    return new KicadSymbolLibGeneratorVersion(value)
  }

  override getString(): string {
    return `(generator_version ${quoteIfNeeded(this.value)})`
  }
}
SxClass.register(KicadSymbolLibGeneratorVersion)
