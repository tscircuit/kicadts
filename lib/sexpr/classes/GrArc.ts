import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"

export interface GrArcPoint {
  x: number
  y: number
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "mid",
  "end",
  "layer",
  "width",
  "stroke",
  "tstamp",
  "uuid",
])

export interface GrArcConstructorParams {
  start?: GrArcStart | GrArcPoint
  mid?: GrArcMid | GrArcPoint
  end?: GrArcEnd | GrArcPoint
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

export class GrArc extends SxClass {
  static override token = "gr_arc"
  override token = "gr_arc"

  private _sxStart?: GrArcStart
  private _sxMid?: GrArcMid
  private _sxEnd?: GrArcEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: GrArcConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArc {
    const grArc = new GrArc()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const unexpectedTokens = new Set<string>()
    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        unexpectedTokens.add(token)
      }
    }
    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        unexpectedTokens.add(token)
        continue
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `gr_arc does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_arc expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_arc encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    grArc._sxStart = propertyMap.start as GrArcStart | undefined
    grArc._sxMid = propertyMap.mid as GrArcMid | undefined
    grArc._sxEnd = propertyMap.end as GrArcEnd | undefined
    grArc._sxLayer = propertyMap.layer as Layer | undefined
    grArc._sxWidth = propertyMap.width as Width | undefined
    grArc._sxStroke = propertyMap.stroke as Stroke | undefined
    grArc._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    grArc._sxUuid = propertyMap.uuid as Uuid | undefined

    if (!grArc._sxStart) {
      throw new Error("gr_arc requires a start child token")
    }
    if (!grArc._sxMid) {
      throw new Error("gr_arc requires a mid child token")
    }
    if (!grArc._sxEnd) {
      throw new Error("gr_arc requires an end child token")
    }
    if (!grArc._sxLayer) {
      throw new Error("gr_arc requires a layer child token")
    }

    return grArc
  }

  get start(): GrArcStart | undefined {
    return this._sxStart
  }

  set start(value: GrArcStart | GrArcPoint | undefined) {
    this._sxStart = this.normalizeStart(value)
  }

  get mid(): GrArcMid | undefined {
    return this._sxMid
  }

  set mid(value: GrArcMid | GrArcPoint | undefined) {
    this._sxMid = this.normalizeMid(value)
  }

  get end(): GrArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: GrArcEnd | GrArcPoint | undefined) {
    this._sxEnd = this.normalizeEnd(value)
  }

  get startPoint(): GrArcPoint | undefined {
    return this._sxStart?.toObject()
  }

  get midPoint(): GrArcPoint | undefined {
    return this._sxMid?.toObject()
  }

  get endPoint(): GrArcPoint | undefined {
    return this._sxEnd?.toObject()
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
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  private normalizeStart(
    value: GrArcStart | GrArcPoint | undefined,
  ): GrArcStart | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrArcStart) {
      return value
    }
    return new GrArcStart(value.x, value.y)
  }

  private normalizeMid(
    value: GrArcMid | GrArcPoint | undefined,
  ): GrArcMid | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrArcMid) {
      return value
    }
    return new GrArcMid(value.x, value.y)
  }

  private normalizeEnd(
    value: GrArcEnd | GrArcPoint | undefined,
  ): GrArcEnd | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrArcEnd) {
      return value
    }
    return new GrArcEnd(value.x, value.y)
  }
}
SxClass.register(GrArc)

export class GrArcStart extends SxClass {
  static override token = "start"
  static override parentToken = "gr_arc"
  override token = "start"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArcStart {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("gr_arc start expects numeric coordinates")
    }
    return new GrArcStart(x, y)
  }

  toObject(): GrArcPoint {
    return { x: this.x, y: this.y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(GrArcStart)

export class GrArcMid extends SxClass {
  static override token = "mid"
  static override parentToken = "gr_arc"
  override token = "mid"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArcMid {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("gr_arc mid expects numeric coordinates")
    }
    return new GrArcMid(x, y)
  }

  toObject(): GrArcPoint {
    return { x: this.x, y: this.y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(mid ${this.x} ${this.y})`
  }
}
SxClass.register(GrArcMid)

export class GrArcEnd extends SxClass {
  static override token = "end"
  static override parentToken = "gr_arc"
  override token = "end"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrArcEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("gr_arc end expects numeric coordinates")
    }
    return new GrArcEnd(x, y)
  }

  toObject(): GrArcPoint {
    return { x: this.x, y: this.y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(GrArcEnd)
