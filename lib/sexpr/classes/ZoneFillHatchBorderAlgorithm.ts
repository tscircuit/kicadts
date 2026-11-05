import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneFillHatchBorderAlgorithm extends SxPrimitiveString {
  static override token = "hatch_border_algorithm"
  static override parentToken = "fill"
  override token = "hatch_border_algorithm"
}
SxClass.register(ZoneFillHatchBorderAlgorithm)
