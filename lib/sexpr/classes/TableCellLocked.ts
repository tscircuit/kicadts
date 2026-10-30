import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableCellLocked extends SxPrimitiveBoolean {
  static override token = "locked"
  static override parentToken = "table_cell"
  override token = "locked"
}
SxClass.register(TableCellLocked)
