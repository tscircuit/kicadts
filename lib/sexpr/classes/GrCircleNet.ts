import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class GrCircleNet extends SxClass {
  static override token = "net"
  static override parentToken = "gr_circle"
  override token = "net"

  constructor(public value: number | string) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrCircleNet {
    const value = primitiveSexprs[0]
    const id = toNumberValue(value)
    if (id !== undefined) {
      return new GrCircleNet(id)
    }

    const name = toStringValue(value)
    if (name !== undefined) {
      return new GrCircleNet(name)
    }

    throw new Error("gr_circle net requires a numeric id or string name")
  }

  override getString(): string {
    if (typeof this.value === "number") {
      return `(net ${this.value})`
    }

    return `(net ${quoteSExprString(this.value)})`
  }
}
SxClass.register(GrCircleNet)
