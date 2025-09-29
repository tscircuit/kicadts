import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadZoneConnect extends SxPrimitiveNumber {
  static override token = "zone_connect"
  static override parentToken = "pad"
  token = "zone_connect"
}
SxClass.register(PadZoneConnect)
