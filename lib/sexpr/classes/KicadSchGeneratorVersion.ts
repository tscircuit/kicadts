import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
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
    const serialized = /^[^\s()\"]+$/.test(this.value)
      ? this.value
      : quoteSExprString(this.value)
    return `(generator_version ${serialized})`
  }
}
SxClass.register(KicadSchGeneratorVersion)
