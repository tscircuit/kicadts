import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class DimensionArrowDirection extends SxPrimitiveString {
  static override token = "arrow_direction"
  static override parentToken = "style"
  token = "arrow_direction"
}
SxClass.register(DimensionArrowDirection)
