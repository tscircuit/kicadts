import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class Back extends SxClass {
  static override token = "back"
  token = "back"
  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Back {
    const val = toStringValue(primitiveSexprs[0])
    return new Back(val === "yes" || val === "true")
  }

  override getString() {
    return `(back ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(Back)
