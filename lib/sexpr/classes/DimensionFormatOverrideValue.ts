import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatOverrideValue extends SxPrimitiveString {
  static override token = "override_value"
  static override parentToken = "format"
  token = "override_value"
}
SxClass.register(DimensionFormatOverrideValue)
