import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class PadThermalBridgeWidth extends SxPrimitiveNumber {
  static override token = "thermal_bridge_width"
  static override parentToken = "pad"
  override token = "thermal_bridge_width"
}
SxClass.register(PadThermalBridgeWidth)
