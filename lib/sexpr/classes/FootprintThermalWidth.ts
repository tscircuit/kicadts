import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintThermalWidth extends SxPrimitiveNumber {
  static override token = "thermal_width"
  static override parentToken = "footprint"
  token = "thermal_width"
}
SxClass.register(FootprintThermalWidth)
