import { SxClass } from "../base-classes/SxClass"
import { TextBoxFill } from "./TextBoxFill"

export class TableCellFill extends TextBoxFill {
  static override parentToken = "table_cell"
}
SxClass.register(TableCellFill)
