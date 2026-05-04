import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class FpLineNet extends SxClass {
  static override token = "net"
  static override parentToken = "fp_line"
  override token = "net"

  constructor(public id: number) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpLineNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id === undefined) {
      throw new Error("fp_line net requires a numeric id")
    }
    return new FpLineNet(id)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(net ${this.id})`
  }
}
SxClass.register(FpLineNet)
