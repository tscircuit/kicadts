import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class DimensionHeight extends SxPrimitiveNumber {
  static override token = "height"
  static override parentToken = "dimension"
  token = "height"
}
SxClass.register(DimensionHeight)
