import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatSuppressZeros extends SxPrimitiveBoolean {
  static override token = "suppress_zeroes"
  static override parentToken = "format"
  token = "suppress_zeroes"
}
SxClass.register(DimensionFormatSuppressZeros)
