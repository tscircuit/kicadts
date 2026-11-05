import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneFillMode extends SxPrimitiveString {
  static override token = "mode"
  static override parentToken = "fill"
  override token = "mode"
}
SxClass.register(ZoneFillMode)
