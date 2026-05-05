import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At, type AtInput } from "./At"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { PointSize } from "./PointSize"

export class FpPoint extends SxClass {
  static override token = "point"
  token = "point"

  private _sxAt?: At
  private _sxSize?: PointSize
  private _sxLayer?: Layer
  private _sxUuid?: Uuid

  constructor(
    opts: { at?: AtInput; size?: number; layer?: string; uuid?: string } = {},
  ) {
    super()
    if (opts.at !== undefined) this._sxAt = At.from(opts.at)
    if (opts.size !== undefined) this._sxSize = new PointSize(opts.size)
    if (opts.layer !== undefined) this._sxLayer = new Layer([opts.layer])
    if (opts.uuid !== undefined) this._sxUuid = new Uuid(opts.uuid)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpPoint {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    const point = new FpPoint()
    point._sxAt = propertyMap.at as At
    point._sxSize = propertyMap.size as PointSize
    point._sxLayer = propertyMap.layer as Layer
    point._sxUuid = propertyMap.uuid as Uuid
    return point
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get size(): number | undefined {
    return this._sxSize?.value
  }

  set size(value: number | undefined) {
    this._sxSize = value !== undefined ? new PointSize(value) : undefined
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | undefined) {
    this._sxLayer = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | undefined) {
    this._sxUuid = value
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
SxClass.register(FpPoint)
