import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class GrLineAngle extends SxPrimitiveNumber {
  static override token = "angle"
  static override parentToken = "gr_line"
  override token = "angle"

  constructor(value: number) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrLineAngle {
    const [rawAngle] = primitiveSexprs
    const angle = toNumberValue(rawAngle)

    if (angle === undefined) {
      throw new Error("gr_line angle expects a numeric value")
    }

    return new GrLineAngle(angle)
  }

  override getString(): string {
    return `(angle ${this.value})`
  }
}
SxClass.register(GrLineAngle)
