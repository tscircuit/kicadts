import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillHatchMinHoleArea extends SxPrimitiveNumber {
  static override token = "hatch_min_hole_area"
  static override parentToken = "fill"
  override token = "hatch_min_hole_area"
}
SxClass.register(ZoneFillHatchMinHoleArea)
