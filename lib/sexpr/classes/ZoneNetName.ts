import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneNetName extends SxPrimitiveString {
  static override token = "net_name"
  static override parentToken = "zone"
  override token = "net_name"
}
SxClass.register(ZoneNetName)
