import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneConnectPadsClearance extends SxPrimitiveNumber {
  static override token = "clearance"
  static override parentToken = "connect_pads"
  override token = "clearance"
}
SxClass.register(ZoneConnectPadsClearance)
