import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionTextPositionMode extends SxPrimitiveNumber {
  static override token = "text_position_mode"
  static override parentToken = "style"
  token = "text_position_mode"
}
SxClass.register(DimensionTextPositionMode)
