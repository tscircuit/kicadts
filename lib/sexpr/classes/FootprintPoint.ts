import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { FootprintPointSize } from "./FootprintPointSize"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"

export class FootprintPoint extends SxClass {
  static override token = "point"
  static override parentToken = "footprint"
  override token = "point"

  private _sxAt?: At
  private _sxSize?: FootprintPointSize
  private _sxLayer?: Layer
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintPoint {
    const point = new FootprintPoint()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    point._sxAt = propertyMap.at as At | undefined
    point._sxSize = propertyMap.size as FootprintPointSize | undefined
    point._sxLayer = propertyMap.layer as Layer | undefined
    point._sxUuid = propertyMap.uuid as Uuid | undefined
    return point
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(FootprintPoint)
