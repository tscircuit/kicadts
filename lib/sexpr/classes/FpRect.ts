import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class FpRect extends SxClass {
  static override token = "fp_rect"
  token = "fp_rect"

  private _sxStart?: FpRectStart
  private _sxEnd?: FpRectEnd
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: FpRectFill
  private _sxUuid?: Uuid
  private _locked = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpRect {
    const rect = new FpRect()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    rect._sxStart = propertyMap.start as FpRectStart | undefined
    rect._sxEnd = propertyMap.end as FpRectEnd | undefined
    rect._sxLayer = propertyMap.layer as Layer | undefined
    rect._sxWidth = propertyMap.width as Width | undefined
    rect._sxStroke = propertyMap.stroke as Stroke | undefined
    rect._sxFill = propertyMap.fill as FpRectFill | undefined
    rect._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (primitive === "locked") {
        rect._locked = true
      }
    }

    return rect
  }

  get start(): FpRectStart | undefined {
    return this._sxStart
  }

  set start(value: FpRectStart | { x: number; y: number } | undefined,) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    if (value instanceof FpRectStart) {
      this._sxStart = value
      return
    }
    this._sxStart = new FpRectStart(value.x, value.y)
  }

  get end(): FpRectEnd | undefined {
    return this._sxEnd
  }

  set end(value: FpRectEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof FpRectEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new FpRectEnd(value.x, value.y)
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

  get fill(): boolean | undefined {
    return this._sxFill?.filled
  }

  set fill(value: boolean | FpRectFill | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof FpRectFill) {
      this._sxFill = value
      return
    }
    this._sxFill = new FpRectFill(value)
  }

  get fillClass(): FpRectFill | undefined {
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
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = ["(fp_rect"]
    const push = (value?: SxClass) => {
      if (!value) return
      lines.push(value.getStringIndented())
    }

    push(this._sxStart)
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
SxClass.register(FpRect)

export class FpRectStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_rect"
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
  ): FpRectStart {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpRectStart(x, y)
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(FpRectStart)

export class FpRectEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_rect"
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
  ): FpRectEnd {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new FpRectEnd(x, y)
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpRectEnd)

export class FpRectFill extends SxClass {
  static override token = "fill"
  static override parentToken = "fp_rect"
  token = "fill"

  filled: boolean

  constructor(filled: boolean) {
    super()
    this.filled = filled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpRectFill {
    const state = toStringValue(primitiveSexprs[0])
    return new FpRectFill(state === "yes")
  }

  override getString(): string {
    return `(fill ${this.filled ? "yes" : "no"})`
  }
}
SxClass.register(FpRectFill)
