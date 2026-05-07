import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class ZoneNet extends SxClass {
  static override token = "net"
  static override parentToken = "zone"
  override token = "net"

  constructor(public value: number | string) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneNet {
    const numberValue = toNumberValue(primitiveSexprs[0])
    if (numberValue !== undefined) return new ZoneNet(numberValue)

    const stringValue = toStringValue(primitiveSexprs[0])
    if (stringValue === undefined) {
      throw new Error("zone net requires a numeric id or string name")
    }
    return new ZoneNet(stringValue)
  }

  override getString(): string {
    return `(net ${typeof this.value === "number" ? this.value : quoteIfNeeded(this.value)})`
  }
}
SxClass.register(ZoneNet)
