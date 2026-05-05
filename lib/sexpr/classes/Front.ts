import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class Front extends SxClass {
  static override token = "front"
  token = "front"
  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Front {
    const val = toStringValue(primitiveSexprs[0])
    return new Front(val === "yes" || val === "true")
  }

  override getString() {
    return `(front ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(Front)
