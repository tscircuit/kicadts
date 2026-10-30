import { SxClass } from "../base-classes/SxClass"
import { TextBoxSize } from "./TextBoxSize"

export class TableCellSize extends TextBoxSize {
  static override parentToken = "table_cell"
}
SxClass.register(TableCellSize)
