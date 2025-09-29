import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintSolderPasteRatio extends SxPrimitiveNumber {
  static override token = "solder_paste_ratio"
  static override parentToken = "footprint"
  token = "solder_paste_ratio"
}
SxClass.register(FootprintSolderPasteRatio)
