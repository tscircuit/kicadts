import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillHatchThickness extends SxPrimitiveNumber {
  static override token = "hatch_thickness"
  static override parentToken = "fill"
  override token = "hatch_thickness"
}
SxClass.register(ZoneFillHatchThickness)
