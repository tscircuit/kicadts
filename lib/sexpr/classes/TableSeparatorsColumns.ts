import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableSeparatorsColumns extends SxPrimitiveBoolean {
  static override token = "cols"
  static override parentToken = "separators"
  override token = "cols"
}
SxClass.register(TableSeparatorsColumns)
