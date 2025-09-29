import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintClearance extends SxPrimitiveNumber {
  static override token = "clearance"
  static override parentToken = "footprint"
  token = "clearance"
}
SxClass.register(FootprintClearance)
