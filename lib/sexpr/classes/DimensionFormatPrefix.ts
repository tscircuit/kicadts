import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class DimensionFormatPrefix extends SxPrimitiveString {
  static override token = "prefix"
  static override parentToken = "format"
  token = "prefix"
}
SxClass.register(DimensionFormatPrefix)
