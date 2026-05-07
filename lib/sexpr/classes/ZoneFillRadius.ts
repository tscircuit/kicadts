import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillRadius extends SxPrimitiveNumber {
  static override token = "radius"
  static override parentToken = "fill"
  override token = "radius"
}
SxClass.register(ZoneFillRadius)
