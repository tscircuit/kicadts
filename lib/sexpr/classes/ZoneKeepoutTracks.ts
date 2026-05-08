import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneKeepoutTracks extends SxPrimitiveString {
  static override token = "tracks"
  static override parentToken = "keepout"
  override token = "tracks"
}
SxClass.register(ZoneKeepoutTracks)
