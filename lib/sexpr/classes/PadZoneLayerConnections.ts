import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class PadZoneLayerConnections extends SxClass {
  static override token = "zone_layer_connections"
  static override parentToken = "pad"
  override token = "zone_layer_connections"

  constructor(public layers: string[] = []) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[] = [],
  ): PadZoneLayerConnections {
    const layers = primitiveSexprs.map((primitive) => {
      if (typeof primitive !== "string") {
        throw new Error("pad zone_layer_connections expects layer name strings")
      }
      return primitive
    })
    return new PadZoneLayerConnections(layers)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const layers = this.layers.map(quoteSExprString).join(" ")
    return layers
      ? `(zone_layer_connections ${layers})`
      : "(zone_layer_connections)"
  }
}
SxClass.register(PadZoneLayerConnections)
