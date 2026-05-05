import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class PointSize extends SxClass {
  static override token = "size"
  static override parentToken = "point"
  token = "size"
  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PointSize {
    const val = toNumberValue(primitiveSexprs[0])
    if (val === undefined) {
      throw new Error("Point size expects a numeric value")
    }
    return new PointSize(val)
  }

  override getString() {
    return `(size ${this.value})`
  }
}
SxClass.register(PointSize)
