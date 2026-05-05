import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class Capping extends SxClass {
  static override token = "capping"
  token = "capping"
  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Capping {
    const val = toStringValue(primitiveSexprs[0])
    return new Capping(val === "yes" || val === "true")
  }

  override getString() {
    return `(capping ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(Capping)
