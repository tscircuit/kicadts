import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"

export class ZoneAttrTeardropType extends SxPrimitiveString {
  static override token = "type"
  static override parentToken = "teardrop"
  override token = "type"
}
SxClass.register(ZoneAttrTeardropType)
