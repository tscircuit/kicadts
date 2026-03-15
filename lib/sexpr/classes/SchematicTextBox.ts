import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { Stroke } from "./Stroke"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "exclude_from_sim",
  "at",
  "size",
  "margins",
  "stroke",
  "fill",
  "effects",
  "uuid",
])

export interface SchematicTextBoxConstructorParams {
  text?: string
  excludeFromSim?: boolean | ExcludeFromSim
  at?: AtInput
  size?: SchematicTextBoxSize | { width: number; height: number }
  margins?:
    | SchematicTextBoxMargins
    | { top: number; right: number; bottom: number; left: number }
  stroke?: Stroke
  fill?: SchematicTextBoxFill
  effects?: TextEffects
  uuid?: string | Uuid
}

export class SchematicTextBox extends SxClass {
  static override token = "text_box"
  override token = "text_box"

  private _text = ""
  private _sxExcludeFromSim?: ExcludeFromSim
  private _sxAt?: At
  private _sxSize?: SchematicTextBoxSize
  private _sxMargins?: SchematicTextBoxMargins
  private _sxStroke?: Stroke
  private _sxFill?: SchematicTextBoxFill
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid

  constructor(params: SchematicTextBoxConstructorParams = {}) {
    super()

    if (params.text !== undefined) this.text = params.text
    if (params.excludeFromSim !== undefined) {
      this.excludeFromSim =
        typeof params.excludeFromSim === "boolean"
          ? params.excludeFromSim
          : params.excludeFromSim.value
    }
    if (params.at !== undefined) this.at = params.at
    if (params.size !== undefined) this.size = params.size
    if (params.margins !== undefined) this.margins = params.margins
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.effects !== undefined) this.effects = params.effects
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicTextBox {
    const [textPrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(textPrimitive)
    if (value === undefined) {
      throw new Error("text_box expects a string value")
    }

    const textBox = new SchematicTextBox()
    textBox._text = value

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `text_box encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `text_box encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `text_box does not support repeated child token "${token}"`,
        )
      }
    }

    textBox._sxExcludeFromSim =
      (arrayPropertyMap.exclude_from_sim?.[0] as ExcludeFromSim | undefined) ??
      (propertyMap.exclude_from_sim as ExcludeFromSim | undefined)
    textBox._sxAt =
      (arrayPropertyMap.at?.[0] as At | undefined) ??
      (propertyMap.at as At | undefined)
    textBox._sxSize =
      (arrayPropertyMap.size?.[0] as SchematicTextBoxSize | undefined) ??
      (propertyMap.size as SchematicTextBoxSize | undefined)
    textBox._sxMargins =
      (arrayPropertyMap.margins?.[0] as SchematicTextBoxMargins | undefined) ??
      (propertyMap.margins as SchematicTextBoxMargins | undefined)
    textBox._sxStroke =
      (arrayPropertyMap.stroke?.[0] as Stroke | undefined) ??
      (propertyMap.stroke as Stroke | undefined)
    textBox._sxFill =
      (arrayPropertyMap.fill?.[0] as SchematicTextBoxFill | undefined) ??
      (propertyMap.fill as SchematicTextBoxFill | undefined)
    textBox._sxEffects =
      (arrayPropertyMap.effects?.[0] as TextEffects | undefined) ??
      (propertyMap.effects as TextEffects | undefined)
    textBox._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)

    return textBox
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  get excludeFromSim(): boolean {
    return this._sxExcludeFromSim?.value ?? false
  }

  set excludeFromSim(value: boolean) {
    this._sxExcludeFromSim = value ? new ExcludeFromSim(true) : undefined
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
  }

  get size(): SchematicTextBoxSize | undefined {
    return this._sxSize
  }

  set size(value:
    | SchematicTextBoxSize
    | { width: number; height: number }
    | undefined,) {
    if (value === undefined) {
      this._sxSize = undefined
      return
    }
    this._sxSize =
      value instanceof SchematicTextBoxSize
        ? value
        : new SchematicTextBoxSize(value.width, value.height)
  }

  get margins(): SchematicTextBoxMargins | undefined {
    return this._sxMargins
  }

  set margins(value:
    | SchematicTextBoxMargins
    | { top: number; right: number; bottom: number; left: number }
    | undefined,) {
    if (value === undefined) {
      this._sxMargins = undefined
      return
    }
    this._sxMargins =
      value instanceof SchematicTextBoxMargins
        ? value
        : new SchematicTextBoxMargins(
            value.top,
            value.right,
            value.bottom,
            value.left,
          )
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SchematicTextBoxFill | undefined {
    return this._sxFill
  }

  set fill(value: SchematicTextBoxFill | undefined) {
    this._sxFill = value
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
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
    if (this._sxExcludeFromSim) children.push(this._sxExcludeFromSim)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxMargins) children.push(this._sxMargins)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = [`(text_box ${quoteSExprString(this._text)}`]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SchematicTextBox)

export class SchematicTextBoxSize extends SxClass {
  static override token = "size"
  static override parentToken = "text_box"
  override token = "size"

  width: number
  height: number

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicTextBoxSize {
    const [rawW, rawH] = primitiveSexprs
    const w = Number(rawW)
    const h = Number(rawH)
    return new SchematicTextBoxSize(
      Number.isFinite(w) ? w : 0,
      Number.isFinite(h) ? h : 0,
    )
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(size ${this.width} ${this.height})`
  }
}
SxClass.register(SchematicTextBoxSize)

export class SchematicTextBoxFill extends SxClass {
  static override token = "fill"
  static override parentToken = "text_box"
  override token = "fill"

  private _sxType?: SchematicTextBoxFillType

  constructor(type?: string) {
    super()
    if (type !== undefined) {
      this._sxType = new SchematicTextBoxFillType(type)
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicTextBoxFill {
    const fill = new SchematicTextBoxFill()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      "fill",
    )
    fill._sxType = propertyMap.type as SchematicTextBoxFillType | undefined
    return fill
  }

  get type(): string | undefined {
    return this._sxType?.value
  }

  set type(value: string | undefined) {
    if (value === undefined) {
      this._sxType = undefined
      return
    }
    this._sxType = new SchematicTextBoxFillType(value)
  }

  override getChildren(): SxClass[] {
    return this._sxType ? [this._sxType] : []
  }
}
SxClass.register(SchematicTextBoxFill)

export class SchematicTextBoxMargins extends SxClass {
  static override token = "margins"
  static override parentToken = "text_box"
  override token = "margins"

  top: number
  right: number
  bottom: number
  left: number

  constructor(top: number, right: number, bottom: number, left: number) {
    super()
    this.top = top
    this.right = right
    this.bottom = bottom
    this.left = left
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicTextBoxMargins {
    const [rawTop, rawRight, rawBottom, rawLeft] = primitiveSexprs
    return new SchematicTextBoxMargins(
      Number(rawTop) || 0,
      Number(rawRight) || 0,
      Number(rawBottom) || 0,
      Number(rawLeft) || 0,
    )
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(margins ${this.top} ${this.right} ${this.bottom} ${this.left})`
  }
}
SxClass.register(SchematicTextBoxMargins)

export class SchematicTextBoxFillType extends SxClass {
  static override token = "type"
  static override parentToken = "fill"
  override token = "type"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicTextBoxFillType {
    const [valuePrimitive] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("fill type expects a string value")
    }
    return new SchematicTextBoxFillType(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(type ${this.value})`
  }
}
SxClass.register(SchematicTextBoxFillType)
