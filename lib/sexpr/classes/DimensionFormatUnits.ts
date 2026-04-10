import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatUnits extends SxPrimitiveNumber {
  static override token = "units"
  static override parentToken = "format"
  token = "units"
}
SxClass.register(DimensionFormatUnits)
