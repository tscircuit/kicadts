import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillIslandAreaMin extends SxPrimitiveNumber {
  static override token = "island_area_min"
  static override parentToken = "fill"
  override token = "island_area_min"
}
SxClass.register(ZoneFillIslandAreaMin)
