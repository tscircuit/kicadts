import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionLeaderLength extends SxPrimitiveNumber {
  static override token = "leader_length"
  static override parentToken = "dimension"
  token = "leader_length"
}
SxClass.register(DimensionLeaderLength)
