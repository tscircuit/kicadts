import { SxClass } from "../base-classes/SxClass"
import { SymbolTextBox } from "./SymbolTextBox"

export class SchematicTextBox extends SymbolTextBox {
  static override token = "text_box"
  static override parentToken = "kicad_sch"
  override token = "text_box"
}
SxClass.register(SchematicTextBox)
