import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillIslandRemovalMode extends SxPrimitiveNumber {
  static override token = "island_removal_mode"
  static override parentToken = "fill"
  override token = "island_removal_mode"
}
SxClass.register(ZoneFillIslandRemovalMode)
