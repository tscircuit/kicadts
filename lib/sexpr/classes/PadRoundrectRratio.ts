import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadRoundrectRratio extends SxPrimitiveNumber {
  static override token = "roundrect_rratio"
  static override parentToken = "pad"
  token = "roundrect_rratio"
}
SxClass.register(PadRoundrectRratio)
