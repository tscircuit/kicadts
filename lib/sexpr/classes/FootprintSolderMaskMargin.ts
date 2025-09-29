import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintSolderMaskMargin extends SxPrimitiveNumber {
  static override token = "solder_mask_margin"
  static override parentToken = "footprint"
  token = "solder_mask_margin"
}
SxClass.register(FootprintSolderMaskMargin)
