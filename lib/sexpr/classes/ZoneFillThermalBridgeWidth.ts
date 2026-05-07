import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class ZoneFillThermalBridgeWidth extends SxPrimitiveNumber {
  static override token = "thermal_bridge_width"
  static override parentToken = "fill"
  override token = "thermal_bridge_width"
}
SxClass.register(ZoneFillThermalBridgeWidth)
