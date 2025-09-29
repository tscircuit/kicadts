import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadDieLength extends SxPrimitiveNumber {
  static override token = "die_length"
  static override parentToken = "pad"
  token = "die_length"
}
SxClass.register(PadDieLength)
