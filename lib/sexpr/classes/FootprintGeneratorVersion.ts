import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintGeneratorVersion extends SxPrimitiveString {
  static override token = "generator_version"
  static override parentToken = "footprint"
  override token = "generator_version"

  constructor(value: string | number) {
    super(String(value))
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintGeneratorVersion {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("generator_version expects a string argument")
    }
    return new FootprintGeneratorVersion(value)
  }

  override getString(): string {
    return `(generator_version ${quoteSExprString(String(this.value))})`
  }
}
SxClass.register(FootprintGeneratorVersion)
