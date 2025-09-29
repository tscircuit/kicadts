import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export class PadThermalBridgeAngle extends SxPrimitiveNumber {
  static override token = "thermal_bridge_angle"
  static override parentToken = "pad"
  override token = "thermal_bridge_angle"
}
SxClass.register(PadThermalBridgeAngle)
