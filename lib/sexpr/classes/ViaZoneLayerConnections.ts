import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class ViaZoneLayerConnections extends SxClass {
  static override token = "zone_layer_connections"
  static override parentToken = "via"
  override token = "zone_layer_connections"

  layers: string[]

  constructor(layers: string[] = []) {
    super()
    this.layers = layers
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ViaZoneLayerConnections {
    const layers = primitiveSexprs.map((primitive) => {
      const layer = toStringValue(primitive)
      if (layer === undefined) {
        throw new Error("via zone_layer_connections expects layer name strings")
      }
      return layer
    })
    return new ViaZoneLayerConnections(layers)
  }

  override getString(): string {
    const layers = this.layers.map(quoteSExprString).join(" ")
    return layers
      ? `(zone_layer_connections ${layers})`
      : "(zone_layer_connections)"
  }
}
SxClass.register(ViaZoneLayerConnections)
