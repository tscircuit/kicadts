import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { Pts } from "./Pts"

function primitiveToString(value: PrimitiveSExpr | undefined): string {
  if (value === undefined) return ""
  const str = toStringValue(value)
  if (str !== undefined) return str
  return printSExpr(value)
}

type FpTextBoxUnknownKind = FpTextBoxUnknown

export class FpTextBox extends SxClass {
  static override token = "fp_text_box"
  token = "fp_text_box"

  private _sxLocked?: FpTextBoxLocked
  private _text = ""
  private _sxStart?: FpTextBoxStart
  private _sxEnd?: FpTextBoxEnd
  private _sxPts?: Pts
  private _sxAngle?: FpTextBoxAngle
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxEffects?: TextEffects
  private _sxStroke?: Stroke
  private _additionalChildren: SxClass[] = []
  private _unknownChildren: FpTextBoxUnknownKind[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextBox {
    const fpTextBox = new FpTextBox()

    let capturedText = false

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "locked") {
          fpTextBox.locked = true
          continue
        }
        if (!capturedText) {
          fpTextBox._text = primitive
          capturedText = true
          continue
        }
        fpTextBox.addUnknown(primitive)
        continue
      }

      if (!capturedText) {
        fpTextBox._text = primitiveToString(primitive)
        capturedText = true
        continue
      }

      fpTextBox.consumePrimitive(primitive)
    }

    return fpTextBox
  }

  private consumePrimitive(primitive: PrimitiveSExpr) {
    if (!Array.isArray(primitive) || primitive.length === 0) {
      this.addUnknown(primitive)
      return
    }

    let parsed: unknown
    try {
      parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })
    } catch (error) {
      this.addUnknown(primitive)
      return
    }

    if (parsed instanceof FpTextBoxStart) {
      this._sxStart = parsed
      return
    }
    if (parsed instanceof FpTextBoxEnd) {
      this._sxEnd = parsed
      return
    }
    if (parsed instanceof Pts) {
      this._sxPts = parsed
      return
    }
    if (parsed instanceof FpTextBoxAngle) {
      this._sxAngle = parsed
      return
    }
    if (parsed instanceof Layer) {
      this._sxLayer = parsed
      return
    }
    if (parsed instanceof TextEffects) {
      this._sxEffects = parsed
      return
    }
    if (parsed instanceof Stroke) {
      this._sxStroke = parsed
      return
    }
    if (parsed instanceof Uuid) {
      this._sxUuid = parsed
      return
    }

    if (parsed instanceof SxClass) {
      this._additionalChildren.push(parsed)
      return
    }

    this.addUnknown(primitive)
  }

  private addUnknown(primitive: PrimitiveSExpr) {
    this._unknownChildren.push(new FpTextBoxUnknown(primitive))
  }

  get locked(): boolean {
    return this._sxLocked !== undefined
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new FpTextBoxLocked() : undefined
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  get start(): FpTextBoxStart | undefined {
    return this._sxStart
  }

  set start(value: FpTextBoxStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    this._sxStart = value instanceof FpTextBoxStart ? value : new FpTextBoxStart([value.x, value.y])
  }

  get end(): FpTextBoxEnd | undefined {
    return this._sxEnd
  }

  set end(value: FpTextBoxEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    this._sxEnd = value instanceof FpTextBoxEnd ? value : new FpTextBoxEnd([value.x, value.y])
  }

  get pts(): Pts | undefined {
    return this._sxPts
  }

  set pts(value: Pts | undefined) {
    this._sxPts = value
  }

  get angle(): FpTextBoxAngle | undefined {
    return this._sxAngle
  }

  set angle(value: FpTextBoxAngle | number | undefined) {
    if (value === undefined) {
      this._sxAngle = undefined
      return
    }
    this._sxAngle = value instanceof FpTextBoxAngle ? value : new FpTextBoxAngle([value])
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
    } else {
      const names = Array.isArray(value) ? value : [value]
      this._sxLayer = new Layer(names)
    }
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
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

  get additionalChildren(): SxClass[] {
    return [...this._additionalChildren]
  }

  set additionalChildren(children: SxClass[]) {
    this._additionalChildren = [...children]
  }

  get unknownChildren(): FpTextBoxUnknownKind[] {
    return [...this._unknownChildren]
  }

  set unknownChildren(children: FpTextBoxUnknownKind[]) {
    this._unknownChildren = [...children]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxAngle) children.push(this._sxAngle)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxUuid) children.push(this._sxUuid)
    children.push(...this._additionalChildren)
    children.push(...this._unknownChildren)
    return children
  }

  override getString(): string {
    const lines = ["(fp_text_box"]

    if (this._sxLocked) {
      lines.push(this._sxLocked.getStringIndented())
    }

    lines.push(`  ${quoteSExprString(this._text)}`)

    for (const child of this.getChildren()) {
      if (child === this._sxLocked) continue
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpTextBox)

export class FpTextBoxStart extends SxClass {
  static override token = "start"
  static override parentToken = "fp_text_box"
  token = "start"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextBoxStart {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    return new FpTextBoxStart([
      Number.isFinite(x) ? x : 0,
      Number.isFinite(y) ? y : 0,
    ])
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(FpTextBoxStart)

export class FpTextBoxEnd extends SxClass {
  static override token = "end"
  static override parentToken = "fp_text_box"
  token = "end"

  x: number
  y: number

  constructor(args: [number, number]) {
    super()
    this.x = args[0]
    this.y = args[1]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextBoxEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    return new FpTextBoxEnd([
      Number.isFinite(x) ? x : 0,
      Number.isFinite(y) ? y : 0,
    ])
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(FpTextBoxEnd)

export class FpTextBoxAngle extends SxClass {
  static override token = "angle"
  static override parentToken = "fp_text_box"
  token = "angle"

  value: number

  constructor(args: [number]) {
    super()
    this.value = args[0]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextBoxAngle {
    const [raw] = primitiveSexprs
    const numeric =
      typeof raw === "number"
        ? raw
        : toNumberValue(raw as PrimitiveSExpr) ?? 0
    return new FpTextBoxAngle([numeric])
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(angle ${this.value})`
  }
}
SxClass.register(FpTextBoxAngle)

class FpTextBoxLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "fp_text_box"
  token = "locked"

  static override fromSexprPrimitives(): FpTextBoxLocked {
    return new FpTextBoxLocked()
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return "locked"
  }
}
SxClass.register(FpTextBoxLocked)

class FpTextBoxUnknown extends SxClass {
  static override token = "__fp_text_box_unknown__"
  token: string
  private readonly primitive: PrimitiveSExpr

  constructor(primitive: PrimitiveSExpr) {
    super()
    this.primitive = primitive
    this.token = this.resolveToken(primitive)
  }

  private resolveToken(primitive: PrimitiveSExpr): string {
    if (typeof primitive === "string") return primitive
    if (Array.isArray(primitive) && primitive.length > 0) {
      const [token] = primitive
      if (typeof token === "string") return token
    }
    return "__fp_text_box_unknown__"
  }

  get primitiveValue(): PrimitiveSExpr {
    return this.primitive
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return printSExpr(this.primitive)
  }
}
