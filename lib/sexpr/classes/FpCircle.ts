import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class FpCircle extends SxClass {
  static override token = "fp_circle"
  token = "fp_circle"

  private _sxCenter?: FpCircleCenter
  private _sxEnd?: FpCircleEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: FpCircleFill
  private _sxUuid?: Uuid
  private _locked = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCircle {
    const circle = new FpCircle()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    circle._sxCenter = propertyMap.center as FpCircleCenter | undefined
    circle._sxEnd = propertyMap.end as FpCircleEnd | undefined
    circle._sxLayer = propertyMap.layer as Layer | undefined
    circle._sxWidth = propertyMap.width as Width | undefined
    circle._sxStroke = propertyMap.stroke as Stroke | undefined
    circle._sxFill = propertyMap.fill as FpCircleFill | undefined
    circle._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (primitive === "locked") {
        circle._locked = true
      }
    }

    return circle
  }

  get center(): FpCircleCenter | undefined {
    return this._sxCenter
  }

  set center(
    value: FpCircleCenter | { x: number; y: number } | undefined,
  ) {
    if (value === undefined) {
      this._sxCenter = undefined
      return
    }
    if (value instanceof FpCircleCenter) {
      this._sxCenter = value
      return
    }
    this._sxCenter = new FpCircleCenter(value.x, value.y)
  }

  get end(): FpCircleEnd | undefined {
    return this._sxEnd
  }

  set end(value: FpCircleEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof FpCircleEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new FpCircleEnd(value.x, value.y)
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

  get fill(): boolean | undefined {
    return this._sxFill?.filled
  }

  set fill(value: boolean | FpCircleFill | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof FpCircleFill) {
      this._sxFill = value
      return
    }
    this._sxFill = new FpCircleFill(value)
  }

  get fillClass(): FpCircleFill | undefined {
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
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxCenter) children.push(this._sxCenter)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = ["(fp_circle"]
    const push = (value?: SxClass) => {
      if (!value) return
      lines.push(value.getStringIndented())
    }

    push(this._sxCenter)
    push(this._sxEnd)
    push(this._sxLayer)
    push(this._sxWidth)
    push(this._sxStroke)
    push(this._sxFill)
    push(this._sxUuid)

    if (this._locked) {
      lines.push("  locked")
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpCircle)

export class FpCircleCenter extends SxClass {
  static override token = "center"
  static override parentToken = "fp_circle"
  token = "center"

  x: number
  y: number

  constructor(x: number, y: number) {
    super()
    this.x = x
    this.y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCircleCenter {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpCircleCenter(x, y)
  }

  override getString(): string {
    return `(center ${this.x} ${this.y})`
  }
}
SxClass.register(FpCircleCenter)

export class FpCircleEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_circle"
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
  ): FpCircleEnd {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpCircleEnd(x, y)
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpCircleEnd)

export class FpCircleFill extends SxClass {
  static override token = "fill"
  static override parentToken = "fp_circle"
  token = "fill"

  filled: boolean

  constructor(filled: boolean) {
    super()
    this.filled = filled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCircleFill {
    const state = toStringValue(primitiveSexprs[0])
    return new FpCircleFill(state === "yes")
  }

  override getString(): string {
    return `(fill ${this.filled ? "yes" : "no"})`
  }
}
SxClass.register(FpCircleFill)
