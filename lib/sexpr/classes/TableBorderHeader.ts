import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableBorderHeader extends SxPrimitiveBoolean {
  static override token = "header"
  static override parentToken = "border"
  override token = "header"
}
SxClass.register(TableBorderHeader)
