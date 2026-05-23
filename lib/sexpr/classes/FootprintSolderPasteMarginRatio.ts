import { SxClass } from "../base-classes/SxClass"
import { FootprintSolderPasteRatio } from "./FootprintSolderPasteRatio"

export class FootprintSolderPasteMarginRatio extends FootprintSolderPasteRatio {
  static override token = "solder_paste_margin_ratio"
  static override parentToken = "footprint"
  override token = "solder_paste_margin_ratio"
}
SxClass.register(FootprintSolderPasteMarginRatio)
