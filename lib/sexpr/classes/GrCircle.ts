import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { PadPrimitiveGrCircleFill } from "./PadPrimitiveGrCircle"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"

export interface GrCirclePoint {
  x: number
  y: number
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "center",
  "end",
  "layer",
  "width",
  "stroke",
  "fill",
  "tstamp",
  "uuid",
])

export interface GrCircleConstructorParams {
  center?: GrCircleCenter | GrCirclePoint
  end?: GrCircleEnd | GrCirclePoint
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  fill?: PadPrimitiveGrCircleFill | string
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

export class GrCircle extends SxClass {
  static override token = "gr_circle"
  override token = "gr_circle"

  private _sxCenter?: GrCircleCenter
  private _sxEnd?: GrCircleEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: PadPrimitiveGrCircleFill
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: GrCircleConstructorParams = {}) {
    super()
    if (params.center !== undefined) this.center = params.center
    if (params.end !== undefined) this.end = params.end
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrCircle {
    const grCircle = new GrCircle()

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
          `gr_circle does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_circle expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_circle encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    grCircle._sxCenter = propertyMap.center as GrCircleCenter | undefined
    grCircle._sxEnd = propertyMap.end as GrCircleEnd | undefined
    grCircle._sxLayer = propertyMap.layer as Layer | undefined
    grCircle._sxWidth = propertyMap.width as Width | undefined
    grCircle._sxStroke = propertyMap.stroke as Stroke | undefined
    grCircle._sxFill = propertyMap.fill as PadPrimitiveGrCircleFill | undefined
    grCircle._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    grCircle._sxUuid = propertyMap.uuid as Uuid | undefined

    if (!grCircle._sxCenter) {
      throw new Error("gr_circle requires a center child token")
    }
    if (!grCircle._sxEnd) {
      throw new Error("gr_circle requires an end child token")
    }
    if (!grCircle._sxLayer) {
      throw new Error("gr_circle requires a layer child token")
    }

    return grCircle
  }

  get center(): GrCircleCenter | undefined {
    return this._sxCenter
  }

  set center(value: GrCircleCenter | GrCirclePoint | undefined) {
    this._sxCenter = this.normalizeCenter(value)
  }

  get end(): GrCircleEnd | undefined {
    return this._sxEnd
  }

  set end(value: GrCircleEnd | GrCirclePoint | undefined) {
    this._sxEnd = this.normalizeEnd(value)
  }

  get centerPoint(): GrCirclePoint | undefined {
    return this._sxCenter?.toObject()
  }

  get endPoint(): GrCirclePoint | undefined {
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

  get fill(): PadPrimitiveGrCircleFill | undefined {
    return this._sxFill
  }

  set fill(value: PadPrimitiveGrCircleFill | string | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof PadPrimitiveGrCircleFill) {
      this._sxFill = value
      return
    }
    // Parse string to boolean or leave as string for "none"
    const boolValue =
      value === "yes" || value === "true"
        ? true
        : value === "no" || value === "false"
          ? false
          : value
    if (typeof boolValue === "boolean") {
      this._sxFill = new PadPrimitiveGrCircleFill(boolValue)
    } else {
      this._sxFill = new PadPrimitiveGrCircleFill(
        value === "none" ? false : true,
      )
    }
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
    if (this._sxCenter) children.push(this._sxCenter)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  private normalizeCenter(
    value: GrCircleCenter | GrCirclePoint | undefined,
  ): GrCircleCenter | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrCircleCenter) {
      return value
    }
    return new GrCircleCenter(value.x, value.y)
  }

  private normalizeEnd(
    value: GrCircleEnd | GrCirclePoint | undefined,
  ): GrCircleEnd | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrCircleEnd) {
      return value
    }
    return new GrCircleEnd(value.x, value.y)
  }
}
SxClass.register(GrCircle)

export class GrCircleCenter extends SxClass {
  static override token = "center"
  static override parentToken = "gr_circle"
  override token = "center"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrCircleCenter {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("gr_circle center expects numeric coordinates")
    }
    return new GrCircleCenter(x, y)
  }

  toObject(): GrCirclePoint {
    return { x: this.x, y: this.y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(center ${this.x} ${this.y})`
  }
}
SxClass.register(GrCircleCenter)

export class GrCircleEnd extends SxClass {
  static override token = "end"
  static override parentToken = "gr_circle"
  override token = "end"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrCircleEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("gr_circle end expects numeric coordinates")
    }
    return new GrCircleEnd(x, y)
  }

  toObject(): GrCirclePoint {
    return { x: this.x, y: this.y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(GrCircleEnd)
