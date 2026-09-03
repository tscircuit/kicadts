import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class KicadSymbolLibGenerator extends SxPrimitiveString {
  static override token = "generator"
  static override parentToken = "kicad_symbol_lib"
  override token = "generator"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSymbolLibGenerator {
    const [rawValue] = primitiveSexprs
    const parsedValue = toStringValue(rawValue)
    if (parsedValue === undefined) {
      throw new Error("generator expects a string argument")
    }
    return new KicadSymbolLibGenerator(parsedValue)
  }

  override getString(): string {
    const serialized = quoteIfNeeded(this.value)
    return `(generator ${serialized})`
  }
}
SxClass.register(KicadSymbolLibGenerator)
