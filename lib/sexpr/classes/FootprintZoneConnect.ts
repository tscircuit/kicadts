import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintZoneConnect extends SxPrimitiveNumber {
  static override token = "zone_connect"
  static override parentToken = "footprint"
  token = "zone_connect"
}
SxClass.register(FootprintZoneConnect)
