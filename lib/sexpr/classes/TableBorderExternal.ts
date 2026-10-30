import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableBorderExternal extends SxPrimitiveBoolean {
  static override token = "external"
  static override parentToken = "border"
  override token = "external"
}
SxClass.register(TableBorderExternal)
