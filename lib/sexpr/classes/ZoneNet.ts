import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
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
    const value = primitiveSexprs[0]
    if (typeof value === "number") return new ZoneNet(value)

    const stringValue = toStringValue(primitiveSexprs[0])
    if (stringValue === undefined) {
      throw new Error("zone net requires a numeric id or string name")
    }
    return new ZoneNet(stringValue)
  }

  override getString(): string {
    return `(net ${typeof this.value === "number" ? this.value : quoteSExprString(this.value)})`
  }
}
SxClass.register(ZoneNet)
