import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZonePriority extends SxPrimitiveNumber {
  static override token = "priority"
  static override parentToken = "zone"
  override token = "priority"
}
SxClass.register(ZonePriority)
