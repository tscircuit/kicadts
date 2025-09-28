import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

const isSymbolToken = (value: string) => /^[A-Za-z0-9._-]+$/.test(value)

export class KicadSchGenerator extends SxPrimitiveString {
  static override token = "generator"
  static override parentToken = "kicad_sch"
  override token = "generator"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): KicadSchGenerator {
    const [rawValue] = primitiveSexprs
    const parsedValue = toStringValue(rawValue)
    if (parsedValue === undefined) {
      throw new Error("generator expects a string argument")
    }
    return new KicadSchGenerator(parsedValue)
  }

  override getString(): string {
    const serialized = isSymbolToken(this.value)
      ? this.value
      : quoteSExprString(this.value)
    return `(generator ${serialized})`
  }
}
SxClass.register(KicadSchGenerator)
