import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PcbGeneralThickness extends SxPrimitiveNumber {
  static override token = "thickness"
  static override parentToken = "general"
  token = "thickness"
}
SxClass.register(PcbGeneralThickness)
