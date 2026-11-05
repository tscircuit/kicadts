import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillHatchOrientation extends SxPrimitiveNumber {
  static override token = "hatch_orientation"
  static override parentToken = "fill"
  override token = "hatch_orientation"
}
SxClass.register(ZoneFillHatchOrientation)
