import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class PadPinType extends SxPrimitiveString {
  static override token = "pintype"
  static override parentToken = "pad"
  token = "pintype"
}
SxClass.register(PadPinType)
