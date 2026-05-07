import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneKeepoutPads extends SxPrimitiveString {
  static override token = "pads"
  static override parentToken = "keepout"
  override token = "pads"
}
SxClass.register(ZoneKeepoutPads)
