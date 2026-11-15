import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillHatchGap extends SxPrimitiveNumber {
  static override token = "hatch_gap"
  static override parentToken = "fill"
  override token = "hatch_gap"
}
SxClass.register(ZoneFillHatchGap)
