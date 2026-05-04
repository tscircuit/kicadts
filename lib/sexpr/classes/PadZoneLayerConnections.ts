import { SxClass } from "../base-classes/SxClass"

export class PadZoneLayerConnections extends SxClass {
  static override token = "zone_layer_connections"
  static override parentToken = "pad"
  override token = "zone_layer_connections"

  static override fromSexprPrimitives(): PadZoneLayerConnections {
    return new PadZoneLayerConnections()
  }

  override getChildren(): SxClass[] {
    return []
  }
}
SxClass.register(PadZoneLayerConnections)
