import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"

export class TableSeparatorsRows extends SxPrimitiveBoolean {
  static override token = "rows"
  static override parentToken = "separators"
  override token = "rows"
}
SxClass.register(TableSeparatorsRows)
