import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatSuppressZeros extends SxPrimitiveBoolean {
  static override token = "suppress_zeros"
  static override parentToken = "format"
  token = "suppress_zeros"
}
SxClass.register(DimensionFormatSuppressZeros)
