import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class LegacySymbolInstanceValue extends SxPrimitiveString {
  static override token = "value"
  static override parentToken = "path"
  token = "value"
}
SxClass.register(LegacySymbolInstanceValue)
