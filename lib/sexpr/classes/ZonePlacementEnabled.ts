import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class ZonePlacementEnabled extends SxPrimitiveBoolean {
  static override token = "enabled"
  static override parentToken = "placement"
  override token = "enabled"
}
SxClass.register(ZonePlacementEnabled)
