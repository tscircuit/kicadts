import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionTextFrame extends SxPrimitiveNumber {
  static override token = "text_frame"
  static override parentToken = "style"
  token = "text_frame"
}
SxClass.register(DimensionTextFrame)
