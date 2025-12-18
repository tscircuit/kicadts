import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class KicadSymbolLibVersion extends SxPrimitiveNumber {
  static override token = "version"
  static override parentToken = "kicad_symbol_lib"
  override token = "version"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSymbolLibVersion {
    const [value] = primitiveSexprs
    if (typeof value !== "number") {
      throw new Error("version expects a numeric argument")
    }
    return new KicadSymbolLibVersion(value)
  }
}
SxClass.register(KicadSymbolLibVersion)
