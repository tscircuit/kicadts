import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class FpArcAngle extends SxPrimitiveNumber {
  static override token = "angle"
  static override parentToken = "fp_arc"
  override token = "angle"

  constructor(value: number) {
    super(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpArcAngle {
    const angle = toNumberValue(primitiveSexprs[0])

    if (angle === undefined) {
      throw new Error("fp_arc angle expects a numeric value")
    }

    return new FpArcAngle(angle)
  }
}
SxClass.register(FpArcAngle)
