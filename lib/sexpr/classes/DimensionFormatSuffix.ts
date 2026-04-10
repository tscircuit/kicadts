import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatSuffix extends SxPrimitiveString {
  static override token = "suffix"
  static override parentToken = "format"
  token = "suffix"
}
SxClass.register(DimensionFormatSuffix)
