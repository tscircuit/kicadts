import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneName extends SxPrimitiveString {
  static override token = "name"
  static override parentToken = "zone"
  override token = "name"
}
SxClass.register(ZoneName)
