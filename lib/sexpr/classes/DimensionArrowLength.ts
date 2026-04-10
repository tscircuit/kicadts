import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionArrowLength extends SxPrimitiveNumber {
  static override token = "arrow_length"
  static override parentToken = "style"
  token = "arrow_length"
}
SxClass.register(DimensionArrowLength)
