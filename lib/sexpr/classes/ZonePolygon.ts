import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"

export class ZonePolygon extends SxClass {
  static override token = "polygon"
  static override parentToken = "zone"
  override token = "polygon"

  private _sxPts?: Pts

  constructor(pts?: Pts) {
    super()
    this._sxPts = pts
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZonePolygon {
    const polygon = new ZonePolygon()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "pts") {
        throw new Error(`zone polygon encountered unsupported child "${token}"`)
      }
      if (entries.length > 1) {
        throw new Error("zone polygon does not support repeated pts children")
      }
    }
    polygon._sxPts = propertyMap.pts as Pts | undefined
    return polygon
  }

  get pts(): Pts | undefined {
    return this._sxPts
  }

  set pts(value: Pts | undefined) {
    this._sxPts = value
  }

  override getChildren(): SxClass[] {
    return this._sxPts ? [this._sxPts] : []
  }
}
SxClass.register(ZonePolygon)
