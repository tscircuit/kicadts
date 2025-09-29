import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { PcbLayerDefinition } from "./PcbLayerDefinition"

export class PcbLayers extends SxClass {
  static override token = "layers"
  static override parentToken = "kicad_pcb"
  token = "layers"

  private _definitions: PcbLayerDefinition[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbLayers {
    const layers = new PcbLayers()
    layers._definitions = primitiveSexprs.map((primitive) =>
      PcbLayerDefinition.fromPrimitive(primitive),
    )
    return layers
  }

  get definitions(): PcbLayerDefinition[] {
    return [...this._definitions]
  }

  set definitions(value: PcbLayerDefinition[]) {
    this._definitions = [...value]
  }

  override getChildren(): SxClass[] {
    return [...this._definitions]
  }
}
SxClass.register(PcbLayers)
