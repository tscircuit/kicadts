import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatPrecision extends SxPrimitiveNumber {
  static override token = "precision"
  static override parentToken = "format"
  token = "precision"
}
SxClass.register(DimensionFormatPrecision)
