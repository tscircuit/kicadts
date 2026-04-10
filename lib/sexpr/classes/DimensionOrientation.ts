import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionOrientation extends SxPrimitiveNumber {
  static override token = "orientation"
  static override parentToken = "dimension"
  token = "orientation"
}
SxClass.register(DimensionOrientation)
