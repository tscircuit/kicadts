import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxClass } from "../base-classes/SxClass"

export class FootprintThermalGap extends SxPrimitiveNumber {
  static override token = "thermal_gap"
  static override parentToken = "footprint"
  token = "thermal_gap"
}
SxClass.register(FootprintThermalGap)
