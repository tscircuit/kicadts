import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxClass } from "../base-classes/SxClass"

export class DimensionType extends SxPrimitiveString {
  static override token = "type"
  static override parentToken = "dimension"
  token = "type"
}
SxClass.register(DimensionType)
