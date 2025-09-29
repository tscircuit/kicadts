import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadSolderPasteMargin extends SxPrimitiveNumber {
  static override token = "solder_paste_margin"
  static override parentToken = "pad"
  token = "solder_paste_margin"
}
SxClass.register(PadSolderPasteMargin)
