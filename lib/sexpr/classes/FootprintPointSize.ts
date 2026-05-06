import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class FootprintPointSize extends SxPrimitiveNumber {
  static override token = "size"
  static override parentToken = "point"
  override token = "size"
}
SxClass.register(FootprintPointSize)
