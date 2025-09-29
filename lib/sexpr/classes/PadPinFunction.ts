import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class PadPinFunction extends SxPrimitiveString {
  static override token = "pinfunction"
  static override parentToken = "pad"
  token = "pinfunction"
}
SxClass.register(PadPinFunction)
