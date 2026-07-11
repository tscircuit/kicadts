import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class GrArcNet extends SxClass {
  static override token = "net"
  static override parentToken = "gr_arc"
  override token = "net"

  constructor(public value: number | string) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArcNet {
    const value = primitiveSexprs[0]
    const id = toNumberValue(value)
    if (id !== undefined) {
      return new GrArcNet(id)
    }

    const name = toStringValue(value)
    if (name !== undefined) {
      return new GrArcNet(name)
    }

    throw new Error("gr_arc net requires a numeric id or string name")
  }

  override getString(): string {
    if (typeof this.value === "number") {
      return `(net ${this.value})`
    }

    return `(net ${quoteSExprString(this.value)})`
  }
}
SxClass.register(GrArcNet)
