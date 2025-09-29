import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadSolderMaskMargin extends SxPrimitiveNumber {
  static override token = "solder_mask_margin"
  static override parentToken = "pad"
  token = "solder_mask_margin"
}
SxClass.register(PadSolderMaskMargin)
