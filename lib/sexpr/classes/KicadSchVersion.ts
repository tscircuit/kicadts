import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class KicadSchVersion extends SxPrimitiveNumber {
  static override token = "version"
  static override parentToken = "kicad_sch"
  override token = "version"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSchVersion {
    const [rawValue] = primitiveSexprs
    const parsedValue = toNumberValue(rawValue)
    if (parsedValue === undefined) {
      throw new Error("version expects a numeric argument")
    }
    return new KicadSchVersion(parsedValue)
  }
}
SxClass.register(KicadSchVersion)
