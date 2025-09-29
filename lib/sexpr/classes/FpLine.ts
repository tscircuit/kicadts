import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"

const SUPPORTED_SINGLE_TOKENS = new Set([
  "start",
  "end",
  "layer",
  "width",
  "stroke",
  "uuid",
])

export class FpLine extends SxClass {
  static override token = "fp_line"
  static override parentToken = "footprint"
  override token = "fp_line"

  private _sxStart?: FpLineStart
  private _sxEnd?: FpLineEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid
  private _locked = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpLine {
    const fpLine = new FpLine()

    const structuredPrimitives: PrimitiveSExpr[] = []

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "locked") {
          if (fpLine._locked) {
            throw new Error("fp_line encountered duplicate locked flags")
          }
          fpLine._locked = true
          continue
        }
        throw new Error(`fp_line encountered unsupported flag "${primitive}"`)
      }

      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `fp_line encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      structuredPrimitives.push(primitive)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(structuredPrimitives, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `fp_line encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `fp_line encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `fp_line does not support repeated child token "${token}"`,
        )
      }
    }

    fpLine._sxStart =
      (arrayPropertyMap.start?.[0] as FpLineStart | undefined) ??
      (propertyMap.start as FpLineStart | undefined)
    fpLine._sxEnd =
      (arrayPropertyMap.end?.[0] as FpLineEnd | undefined) ??
      (propertyMap.end as FpLineEnd | undefined)
    fpLine._sxLayer =
      (arrayPropertyMap.layer?.[0] as Layer | undefined) ??
      (propertyMap.layer as Layer | undefined)
    fpLine._sxWidth =
      (arrayPropertyMap.width?.[0] as Width | undefined) ??
      (propertyMap.width as Width | undefined)
    fpLine._sxStroke =
      (arrayPropertyMap.stroke?.[0] as Stroke | undefined) ??
      (propertyMap.stroke as Stroke | undefined)
    fpLine._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)

    if (!fpLine._sxStart) {
      throw new Error("fp_line requires a start child token")
    }
    if (!fpLine._sxEnd) {
      throw new Error("fp_line requires an end child token")
    }
    if (!fpLine._sxLayer) {
      throw new Error("fp_line requires a layer child token")
    }

    return fpLine
  }

  get start(): FpLineStart | undefined {
    return this._sxStart
  }

  set start(value: FpLineStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    this._sxStart =
      value instanceof FpLineStart ? value : new FpLineStart(value.x, value.y)
  }

  get end(): FpLineEnd | undefined {
    return this._sxEnd
  }

  set end(value: FpLineEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    this._sxEnd =
      value instanceof FpLineEnd ? value : new FpLineEnd(value.x, value.y)
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

  set width(value: number | undefined) {
    this._sxWidth = value === undefined ? undefined : new Width(value)
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
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) {
      children.push(this._sxStroke)
    } else if (this._sxWidth) {
      children.push(this._sxWidth)
    }
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._locked) children.push(new FpLineLocked())
    return children
  }
}
SxClass.register(FpLine)

export class FpLineStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_line"
  override token = "start"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpLineStart {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("fp_line start expects numeric coordinates")
    }
    return new FpLineStart(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(FpLineStart)

export class FpLineEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_line"
  override token = "end"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpLineEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("fp_line end expects numeric coordinates")
    }
    return new FpLineEnd(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpLineEnd)

class FpLineLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "fp_line"
  override token = "locked"

  static override fromSexprPrimitives(): FpLineLocked {
    return new FpLineLocked()
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return "locked"
  }
}
SxClass.register(FpLineLocked)
