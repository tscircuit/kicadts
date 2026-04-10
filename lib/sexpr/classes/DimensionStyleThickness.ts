import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionStyleThickness extends SxPrimitiveNumber {
  static override token = "thickness"
  static override parentToken = "style"
  token = "thickness"
}
SxClass.register(DimensionStyleThickness)
