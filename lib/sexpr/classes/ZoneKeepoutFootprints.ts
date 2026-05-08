import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneKeepoutFootprints extends SxPrimitiveString {
  static override token = "footprints"
  static override parentToken = "keepout"
  override token = "footprints"
}
SxClass.register(ZoneKeepoutFootprints)
