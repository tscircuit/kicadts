import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatUnitsFormat extends SxPrimitiveNumber {
  static override token = "units_format"
  static override parentToken = "format"
  token = "units_format"
}
SxClass.register(DimensionFormatUnitsFormat)
