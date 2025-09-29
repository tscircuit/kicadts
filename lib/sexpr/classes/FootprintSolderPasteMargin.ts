import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintSolderPasteMargin extends SxPrimitiveNumber {
  static override token = "solder_paste_margin"
  static override parentToken = "footprint"
  token = "solder_paste_margin"
}
SxClass.register(FootprintSolderPasteMargin)
