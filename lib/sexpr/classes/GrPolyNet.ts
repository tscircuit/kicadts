import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class GrPolyNet extends SxClass {
  static override token = "net"
  static override parentToken = "gr_poly"
  override token = "net"

  constructor(public id: number) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrPolyNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id === undefined) {
      throw new Error("gr_poly net requires a numeric id")
    }
    return new GrPolyNet(id)
  }

  override getString(): string {
    return `(net ${this.id})`
  }
}
SxClass.register(GrPolyNet)
