import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadSolderPasteMarginRatio extends SxPrimitiveNumber {
  static override token = "solder_paste_margin_ratio"
  static override parentToken = "pad"
  token = "solder_paste_margin_ratio"
}
SxClass.register(PadSolderPasteMarginRatio)
