import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneMinThickness extends SxPrimitiveNumber {
  static override token = "min_thickness"
  static override parentToken = "zone"
  override token = "min_thickness"
}
SxClass.register(ZoneMinThickness)
