import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Pts } from "./Pts"

export class ZoneFilledPolygon extends SxClass {
  static override token = "filled_polygon"
  static override parentToken = "zone"
  override token = "filled_polygon"

  private _sxLayer?: Layer
  private _sxPts?: Pts

  constructor(params: { layer?: Layer; pts?: Pts; island?: boolean } = {}) {
    super()
    if (params.layer !== undefined) this.layer = params.layer
    if (params.pts !== undefined) this.pts = params.pts
    if (params.island !== undefined) this.island = params.island
  }

  private _island = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneFilledPolygon {
    const polygon = new ZoneFilledPolygon()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "layer" && token !== "pts" && token !== "island") {
        throw new Error(
          `zone filled_polygon encountered unsupported child "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `zone filled_polygon does not support repeated child "${token}"`,
        )
      }
    }
    polygon._sxLayer = propertyMap.layer as Layer | undefined
    polygon._sxPts = propertyMap.pts as Pts | undefined
    const island = propertyMap.island as ZoneFilledPolygonIsland | undefined
    polygon._island = island?.value ?? false
    return polygon
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | undefined) {
    this._sxLayer = value
  }

  get pts(): Pts | undefined {
    return this._sxPts
  }

  set pts(value: Pts | undefined) {
    this._sxPts = value
  }

  get island(): boolean {
    return this._island
  }

  set island(value: boolean) {
    this._island = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._island) children.push(new ZoneFilledPolygonIsland(true))
    if (this._sxPts) children.push(this._sxPts)
    return children
  }
}
SxClass.register(ZoneFilledPolygon)

export class ZoneFilledPolygonIsland extends SxClass {
  static override token = "island"
  static override parentToken = "filled_polygon"
  override token = "island"

  constructor(public value = true) {
    super()
  }

  static override fromSexprPrimitives(): ZoneFilledPolygonIsland {
    return new ZoneFilledPolygonIsland(true)
  }

  override getString(): string {
    return "(island)"
  }
}
SxClass.register(ZoneFilledPolygonIsland)
