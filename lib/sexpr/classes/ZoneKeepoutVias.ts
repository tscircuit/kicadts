import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneKeepoutVias extends SxPrimitiveString {
  static override token = "vias"
  static override parentToken = "keepout"
  override token = "vias"
}
SxClass.register(ZoneKeepoutVias)
