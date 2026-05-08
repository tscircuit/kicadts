import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneFillSmoothing extends SxPrimitiveString {
  static override token = "smoothing"
  static override parentToken = "fill"
  override token = "smoothing"
}
SxClass.register(ZoneFillSmoothing)
