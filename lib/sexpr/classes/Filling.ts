import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class Filling extends SxClass {
  static override token = "filling"
  token = "filling"
  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Filling {
    const val = toStringValue(primitiveSexprs[0])
    return new Filling(val === "yes" || val === "true")
  }

  override getString() {
    return `(filling ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(Filling)
