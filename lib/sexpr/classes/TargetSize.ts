import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class TargetSize extends SxPrimitiveNumber {
  static override token = "size"
  static override parentToken = "target"
  token = "size"
}
SxClass.register(TargetSize)
