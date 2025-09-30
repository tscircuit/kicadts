import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { GrLineStart } from "./GrLineStart"
import { GrLineEnd } from "./GrLineEnd"
import { GrLineAngle } from "./GrLineAngle"
import { GrLineLocked } from "./GrLineLocked"

export interface GrLinePoint {
  x: number
  y: number
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "end",
  "angle",
  "layer",
  "width",
  "stroke",
  "uuid",
  "locked",
])

export interface GrLineConstructorParams {
  start?: GrLineStart | GrLinePoint
  end?: GrLineEnd | GrLinePoint
  angle?: number
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  uuid?: Uuid | string
  locked?: boolean
}

export class GrLine extends SxClass {
  static override token = "gr_line"
  override token = "gr_line"

  private _sxStart?: GrLineStart
  private _sxEnd?: GrLineEnd
  private _sxAngle?: GrLineAngle
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid
  private _sxLocked?: GrLineLocked

  constructor(params: GrLineConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.end !== undefined) this.end = params.end
    if (params.angle !== undefined) this.angle = params.angle
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrLine {
    const grLine = new GrLine()

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
          `gr_line does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_line expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_line encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    grLine._sxStart = propertyMap.start as GrLineStart | undefined
    grLine._sxEnd = propertyMap.end as GrLineEnd | undefined
    grLine._sxAngle = propertyMap.angle as GrLineAngle | undefined
    grLine._sxLayer = propertyMap.layer as Layer | undefined
    grLine._sxWidth = propertyMap.width as Width | undefined
    grLine._sxStroke = propertyMap.stroke as Stroke | undefined
    const locked = propertyMap.locked as GrLineLocked | undefined
    grLine._sxLocked = locked && locked.value ? locked : undefined
    grLine._sxUuid = propertyMap.uuid as Uuid | undefined

    if (!grLine._sxStart) {
      throw new Error("gr_line requires a start child token")
    }
    if (!grLine._sxEnd) {
      throw new Error("gr_line requires an end child token")
    }
    if (!grLine._sxLayer) {
      throw new Error("gr_line requires a layer child token")
    }

    return grLine
  }

  get start(): GrLineStart | undefined {
    return this._sxStart
  }

  set start(value: GrLineStart | GrLinePoint | undefined) {
    this._sxStart = this.normalizeStart(value)
  }

  get end(): GrLineEnd | undefined {
    return this._sxEnd
  }

  set end(value: GrLineEnd | GrLinePoint | undefined) {
    this._sxEnd = this.normalizeEnd(value)
  }

  get startPoint(): GrLinePoint | undefined {
    return this._sxStart?.toObject()
  }

  get endPoint(): GrLinePoint | undefined {
    return this._sxEnd?.toObject()
  }

  get angle(): number | undefined {
    return this._sxAngle?.value
  }

  set angle(value: number | undefined) {
    if (value === undefined) {
      this._sxAngle = undefined
      return
    }
    this._sxAngle = new GrLineAngle(value)
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

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new GrLineLocked(true) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxAngle) children.push(this._sxAngle)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  private normalizeStart(
    value: GrLineStart | GrLinePoint | undefined,
  ): GrLineStart | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrLineStart) {
      return value
    }
    return new GrLineStart(value.x, value.y)
  }

  private normalizeEnd(
    value: GrLineEnd | GrLinePoint | undefined,
  ): GrLineEnd | undefined {
    if (value === undefined) {
      return undefined
    }
    if (value instanceof GrLineEnd) {
      return value
    }
    return new GrLineEnd(value.x, value.y)
  }
}
SxClass.register(GrLine)
