import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "table"
  override token = "locked"
}
SxClass.register(TableLocked)
