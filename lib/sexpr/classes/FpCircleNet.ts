import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class FpCircleNet extends SxClass {
  static override token = "net"
  static override parentToken = "fp_circle"
  override token = "net"

  constructor(public id: number) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCircleNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id === undefined) {
      throw new Error("fp_circle net requires a numeric id")
    }
    return new FpCircleNet(id)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(net ${this.id})`
  }
}
SxClass.register(FpCircleNet)
