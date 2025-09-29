import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

import {
  StackupCastellatedPads,
  StackupCopperFinish,
  StackupDielectricConstraints,
  StackupEdgeConnector,
  StackupEdgePlating,
} from "./StackupProperties"
import { StackupLayer } from "./StackupLayer"

export class Stackup extends SxClass {
  static override token = "stackup"
  static override parentToken = "setup"
  token = "stackup"

  private _layers: StackupLayer[] = []
  private _sxCopperFinish?: StackupCopperFinish
  private _sxDielectricConstraints?: StackupDielectricConstraints
  private _sxEdgeConnector?: StackupEdgeConnector
  private _sxCastellatedPads?: StackupCastellatedPads
  private _sxEdgePlating?: StackupEdgePlating

  constructor(opts: {
    layers?: StackupLayer[]
    copperFinish?: StackupCopperFinish
    dielectricConstraints?: StackupDielectricConstraints
    edgeConnector?: StackupEdgeConnector
    castellatedPads?: StackupCastellatedPads
    edgePlating?: StackupEdgePlating
  } = {}) {
    super()
    this.layers = opts.layers ?? []
    this._sxCopperFinish = opts.copperFinish
    this._sxDielectricConstraints = opts.dielectricConstraints
    this._sxEdgeConnector = opts.edgeConnector
    this._sxCastellatedPads = opts.castellatedPads
    this._sxEdgePlating = opts.edgePlating
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Stackup {
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    return new Stackup({
      layers: (arrayPropertyMap.layer as StackupLayer[] | undefined) ?? [],
      copperFinish: propertyMap.copper_finish as StackupCopperFinish,
      dielectricConstraints:
        propertyMap.dielectric_constraints as StackupDielectricConstraints,
      edgeConnector: propertyMap.edge_connector as StackupEdgeConnector,
      castellatedPads:
        propertyMap.castellated_pads as StackupCastellatedPads,
      edgePlating: propertyMap.edge_plating as StackupEdgePlating,
    })
  }

  get layers(): StackupLayer[] {
    return [...this._layers]
  }

  set layers(layers: StackupLayer[]) {
    this._layers = layers.map((layer) => {
      if (!(layer instanceof StackupLayer)) {
        throw new Error("Stackup layers must be StackupLayer instances")
      }
      return layer
    })
  }

  get copperFinish(): string | undefined {
    return this._sxCopperFinish?.value
  }

  set copperFinish(value: string | undefined) {
    this._sxCopperFinish = value
      ? new StackupCopperFinish(value)
      : undefined
  }

  get dielectricConstraints(): string | undefined {
    return this._sxDielectricConstraints?.value
  }

  set dielectricConstraints(value: string | undefined) {
    this._sxDielectricConstraints = value
      ? new StackupDielectricConstraints(value)
      : undefined
  }

  get edgeConnector(): string | undefined {
    return this._sxEdgeConnector?.value
  }

  set edgeConnector(value: string | undefined) {
    this._sxEdgeConnector = value
      ? new StackupEdgeConnector(value)
      : undefined
  }

  get castellatedPads(): string | undefined {
    return this._sxCastellatedPads?.value
  }

  set castellatedPads(value: string | undefined) {
    this._sxCastellatedPads = value
      ? new StackupCastellatedPads(value)
      : undefined
  }

  get edgePlating(): string | undefined {
    return this._sxEdgePlating?.value
  }

  set edgePlating(value: string | undefined) {
    this._sxEdgePlating = value
      ? new StackupEdgePlating(value)
      : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = [...this._layers]
    const optionalChildren = [
      this._sxCopperFinish,
      this._sxDielectricConstraints,
      this._sxEdgeConnector,
      this._sxCastellatedPads,
      this._sxEdgePlating,
    ]
    for (const child of optionalChildren) {
      if (child) {
        children.push(child)
      }
    }
    return children
  }
}
SxClass.register(Stackup)
