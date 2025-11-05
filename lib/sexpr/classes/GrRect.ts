import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export interface GrRectConstructorParams {
  start?: GrRectStart | { x: number; y: number }
  end?: GrRectEnd | { x: number; y: number }
  layer?: Layer | string | string[]
  width?: number | Width
  stroke?: Stroke
  fill?: boolean | GrRectFill
  uuid?: string | Uuid
  locked?: boolean
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "end",
  "layer",
  "width",
  "stroke",
  "fill",
  "uuid",
  "locked",
])

export class GrRect extends SxClass {
  static override token = "gr_rect"
  override token = "gr_rect"

  private _sxStart?: GrRectStart
  private _sxEnd?: GrRectEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: GrRectFill
  private _sxUuid?: Uuid
  private _sxLocked?: GrRectLocked

  constructor(params: GrRectConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.end !== undefined) this.end = params.end
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRect {
    const grRect = new GrRect()

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
          `gr_rect does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_rect expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_rect encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    grRect._sxStart = propertyMap.start as GrRectStart | undefined
    grRect._sxEnd = propertyMap.end as GrRectEnd | undefined
    grRect._sxLayer = propertyMap.layer as Layer | undefined
    grRect._sxWidth = propertyMap.width as Width | undefined
    grRect._sxStroke = propertyMap.stroke as Stroke | undefined
    grRect._sxFill = propertyMap.fill as GrRectFill | undefined
    const locked = propertyMap.locked as GrRectLocked | undefined
    grRect._sxLocked = locked && locked.value ? locked : undefined
    grRect._sxUuid = propertyMap.uuid as Uuid | undefined

    if (!grRect._sxStart) {
      throw new Error("gr_rect requires a start child token")
    }
    if (!grRect._sxEnd) {
      throw new Error("gr_rect requires an end child token")
    }
    if (!grRect._sxLayer) {
      throw new Error("gr_rect requires a layer child token")
    }

    return grRect
  }

  get start(): GrRectStart | undefined {
    return this._sxStart
  }

  set start(value: GrRectStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    if (value instanceof GrRectStart) {
      this._sxStart = value
      return
    }
    this._sxStart = new GrRectStart(value.x, value.y)
  }

  get end(): GrRectEnd | undefined {
    return this._sxEnd
  }

  set end(value: GrRectEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof GrRectEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new GrRectEnd(value.x, value.y)
  }

  get startPoint(): { x: number; y: number } | undefined {
    return this._sxStart
      ? { x: this._sxStart.x, y: this._sxStart.y }
      : undefined
  }

  get endPoint(): { x: number; y: number } | undefined {
    return this._sxEnd ? { x: this._sxEnd.x, y: this._sxEnd.y } : undefined
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | string[] | undefined) {
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

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: number | Width | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    if (value instanceof Width) {
      this._sxWidth = value
      return
    }
    this._sxWidth = new Width(value)
  }

  get widthClass(): Width | undefined {
    return this._sxWidth
  }

  set widthClass(value: Width | undefined) {
    this._sxWidth = value
  }

  get fill(): boolean | undefined {
    return this._sxFill?.filled
  }

  set fill(value: boolean | GrRectFill | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof GrRectFill) {
      this._sxFill = value
      return
    }
    this._sxFill = new GrRectFill(value)
  }

  get fillClass(): GrRectFill | undefined {
    return this._sxFill
  }

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  set uuid(value: string | Uuid | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    if (value instanceof Uuid) {
      this._sxUuid = value
      return
    }
    this._sxUuid = new Uuid(value)
  }

  get uuidClass(): Uuid | undefined {
    return this._sxUuid
  }

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new GrRectLocked(true) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(GrRect)

export class GrRectStart extends SxClass {
  static override token = "start"
  static override parentToken = "gr_rect"
  override token = "start"

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRectStart {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("gr_rect start expects two numeric arguments")
    }

    return new GrRectStart(x, y)
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  toObject(): { x: number; y: number } {
    return { x: this._x, y: this._y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this._x} ${this._y})`
  }
}
SxClass.register(GrRectStart)

export class GrRectEnd extends SxClass {
  static override token = "end"
  static override parentToken = "gr_rect"
  override token = "end"

  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRectEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("gr_rect end expects two numeric arguments")
    }

    return new GrRectEnd(x, y)
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  toObject(): { x: number; y: number } {
    return { x: this._x, y: this._y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this._x} ${this._y})`
  }
}
SxClass.register(GrRectEnd)

export class GrRectFill extends SxClass {
  static override token = "fill"
  static override parentToken = "gr_rect"
  override token = "fill"

  filled: boolean

  constructor(filled: boolean) {
    super()
    this.filled = filled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRectFill {
    const state = toStringValue(primitiveSexprs[0])
    return new GrRectFill(state === "yes")
  }

  override getString(): string {
    return `(fill ${this.filled ? "yes" : "no"})`
  }
}
SxClass.register(GrRectFill)

export class GrRectLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "gr_rect"
  override token = "locked"

  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrRectLocked {
    if (primitiveSexprs.length === 0) {
      return new GrRectLocked(true)
    }
    const state = toStringValue(primitiveSexprs[0])
    return new GrRectLocked(state === "yes")
  }

  override getString(): string {
    return this.value ? "(locked yes)" : "(locked no)"
  }
}
SxClass.register(GrRectLocked)
