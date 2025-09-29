import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class PadThermalWidth extends SxPrimitiveNumber {
  static override token = "thermal_width"
  static override parentToken = "pad"
  token = "thermal_width"
}
SxClass.register(PadThermalWidth)
