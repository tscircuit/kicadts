import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class GrRectNet extends SxClass {
  static override token = "net"
  static override parentToken = "gr_rect"
  override token = "net"

  constructor(public value: number | string) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRectNet {
    const value = primitiveSexprs[0]
    const id = toNumberValue(value)
    if (id !== undefined) {
      return new GrRectNet(id)
    }

    const name = toStringValue(value)
    if (name !== undefined) {
      return new GrRectNet(name)
    }

    throw new Error("gr_rect net requires a numeric id or string name")
  }

  override getString(): string {
    if (typeof this.value === "number") {
      return `(net ${this.value})`
    }

    return `(net ${quoteSExprString(this.value)})`
  }
}
SxClass.register(GrRectNet)
