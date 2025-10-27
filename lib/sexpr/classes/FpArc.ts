import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"

export interface FpArcConstructorParams {
  start?: FpArcStart | { x: number; y: number }
  mid?: FpArcMid | { x: number; y: number }
  end?: FpArcEnd | { x: number; y: number }
  layer?: Layer | string | string[]
  width?: number | Width
  stroke?: Stroke
  tstamp?: Tstamp | string
  uuid?: string | Uuid
  locked?: boolean
}

export class FpArc extends SxClass {
  static override token = "fp_arc"
  token = "fp_arc"

  private _sxStart?: FpArcStart
  private _sxMid?: FpArcMid
  private _sxEnd?: FpArcEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _locked = false

  constructor(params: FpArcConstructorParams = {}) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpArc {
    const arc = new FpArc()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    arc._sxStart = propertyMap.start as FpArcStart | undefined
    arc._sxMid = propertyMap.mid as FpArcMid | undefined
    arc._sxEnd = propertyMap.end as FpArcEnd | undefined
    arc._sxLayer = propertyMap.layer as Layer | undefined
    arc._sxWidth = propertyMap.width as Width | undefined
    arc._sxStroke = propertyMap.stroke as Stroke | undefined
    arc._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    arc._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (primitive === "locked") {
        arc._locked = true
      }
    }

    return arc
  }

  get start(): FpArcStart | undefined {
    return this._sxStart
  }

  set start(value: FpArcStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    if (value instanceof FpArcStart) {
      this._sxStart = value
      return
    }
    this._sxStart = new FpArcStart(value.x, value.y)
  }

  get mid(): FpArcMid | undefined {
    return this._sxMid
  }

  set mid(value: FpArcMid | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxMid = undefined
      return
    }
    if (value instanceof FpArcMid) {
      this._sxMid = value
      return
    }
    this._sxMid = new FpArcMid(value.x, value.y)
  }

  get end(): FpArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: FpArcEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof FpArcEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new FpArcEnd(value.x, value.y)
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
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = ["(fp_arc"]
    const push = (value?: SxClass) => {
      if (!value) return
      lines.push(value.getStringIndented())
    }

    push(this._sxStart)
    push(this._sxMid)
    push(this._sxEnd)
    push(this._sxLayer)
    push(this._sxWidth)
    push(this._sxStroke)
    push(this._sxTstamp)
    push(this._sxUuid)

    if (this._locked) {
      lines.push("  locked")
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpArc)

export class FpArcStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_arc"
  token = "start"

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpArcStart {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpArcStart(x, y)
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcStart)

export class FpArcMid extends SxClass {
  static override token = "mid"
  static override parentToken = "fp_arc"
  token = "mid"

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpArcMid {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpArcMid(x, y)
  }

  override getString(): string {
    return `(mid ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcMid)

export class FpArcEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_arc"
  token = "end"

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpArcEnd {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpArcEnd(x, y)
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpArcEnd)
