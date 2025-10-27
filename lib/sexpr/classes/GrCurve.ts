import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { Xy } from "./Xy"

const SUPPORTED_TOKENS = new Set([
  "pts",
  "xy",
  "layer",
  "width",
  "stroke",
  "tstamp",
  "uuid",
])

export interface GrCurveConstructorParams {
  points?: Pts | Xy[] | Array<{ x: number; y: number }>
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

export class GrCurve extends SxClass {
  static override token = "gr_curve"
  override token = "gr_curve"

  private _sxPts?: Pts
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: GrCurveConstructorParams = {}) {
    super()
    if (params.points !== undefined) this.points = params.points
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrCurve {
    const grCurve = new GrCurve()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const unexpectedTokens = new Set<string>()
    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        unexpectedTokens.add(token)
      }
    }
    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        unexpectedTokens.add(token)
        continue
      }
      if (token !== "xy" && arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `gr_curve does not support repeated child token "${token}"`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_curve expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    const ptsEntries = arrayPropertyMap.pts as Pts[] | undefined
    if (ptsEntries && ptsEntries.length > 1) {
      throw new Error("gr_curve does not support repeated pts tokens")
    }

    const xyEntries = arrayPropertyMap.xy as Xy[] | undefined
    let pts = propertyMap.pts as Pts | undefined

    if (pts && xyEntries && xyEntries.length > 0) {
      throw new Error("gr_curve cannot mix pts and xy child tokens")
    }

    if (!pts && ptsEntries?.length) {
      pts = ptsEntries[0]
    }

    if (!pts && xyEntries && xyEntries.length > 0) {
      pts = new Pts(xyEntries)
    }

    grCurve._sxPts = pts
    grCurve._sxLayer = propertyMap.layer as Layer | undefined
    grCurve._sxWidth = propertyMap.width as Width | undefined
    grCurve._sxStroke = propertyMap.stroke as Stroke | undefined
    grCurve._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    grCurve._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_curve encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    if (!grCurve._sxPts) {
      throw new Error("gr_curve requires pts or xy child tokens")
    }
    if (!grCurve._sxLayer) {
      throw new Error("gr_curve requires a layer child token")
    }

    return grCurve
  }

  get points(): Pts | undefined {
    return this._sxPts
  }

  set points(value: Pts | Xy[] | Array<{ x: number; y: number }> | undefined) {
    if (value === undefined) {
      this._sxPts = undefined
      return
    }

    if (value instanceof Pts) {
      this._sxPts = value
      return
    }

    if (Array.isArray(value) && value.every((point) => point instanceof Xy)) {
      this._sxPts = new Pts(value as Xy[])
      return
    }

    if (Array.isArray(value)) {
      this._sxPts = new Pts(value.map(({ x, y }) => new Xy(x, y)))
      return
    }

    throw new Error("Unsupported points value provided to gr_curve")
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | Array<string | number> | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    if (value instanceof Layer) {
      this._sxLayer = value
      return
    }
    const names = Array.isArray(value) ? value : [value]
    this._sxLayer = new Layer(names)
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: Width | number | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    this._sxWidth = value instanceof Width ? value : new Width(value)
  }

  get widthClass(): Width | undefined {
    return this._sxWidth
  }

  set widthClass(value: Width | undefined) {
    this._sxWidth = value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: Tstamp | string | undefined) {
    if (value === undefined) {
      this._sxTstamp = undefined
      return
    }
    this._sxTstamp = value instanceof Tstamp ? value : new Tstamp(value)
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(GrCurve)
