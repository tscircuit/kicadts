import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadChamferRatio extends SxPrimitiveNumber {
  static override token = "chamfer_ratio"
  static override parentToken = "pad"
  token = "chamfer_ratio"
}
SxClass.register(PadChamferRatio)
