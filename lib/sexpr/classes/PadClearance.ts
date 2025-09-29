import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadClearance extends SxPrimitiveNumber {
  static override token = "clearance"
  static override parentToken = "pad"
  token = "clearance"
}
SxClass.register(PadClearance)
