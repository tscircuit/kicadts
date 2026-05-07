import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillThermalGap extends SxPrimitiveNumber {
  static override token = "thermal_gap"
  static override parentToken = "fill"
  override token = "thermal_gap"
}
SxClass.register(ZoneFillThermalGap)
