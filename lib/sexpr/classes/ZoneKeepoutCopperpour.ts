import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneKeepoutCopperpour extends SxPrimitiveString {
  static override token = "copperpour"
  static override parentToken = "keepout"
  override token = "copperpour"
}
SxClass.register(ZoneKeepoutCopperpour)
