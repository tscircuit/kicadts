import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadThermalGap extends SxPrimitiveNumber {
  static override token = "thermal_gap"
  static override parentToken = "pad"
  token = "thermal_gap"
}
SxClass.register(PadThermalGap)
