import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Xy } from "./Xy"

export type FpTextType = "reference" | "value" | "user" | string

type FpTextUnknownKind = FpTextUnknown

export class FpText extends SxClass {
  static override token = "fp_text"
  token = "fp_text"

  private _type?: FpTextType
  private _text = ""
  private _sxPosition?: At | Xy
  private _sxUnlocked?: FpTextUnlocked
  private _sxHide?: FpTextHide
  private _sxLayer?: Layer
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid
  private _additionalChildren: SxClass[] = []
  private _unknownChildren: FpTextUnknownKind[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpText {
    const [rawType, rawText, ...rest] = primitiveSexprs
    const fpText = new FpText()

    if (typeof rawType === "string") {
      fpText._type = rawType
    } else if (rawType !== undefined) {
      fpText.addUnknown(rawType)
    }

    fpText._text = primitiveToString(rawText)

    for (const primitive of rest) {
      fpText.consumePrimitive(primitive)
    }

    return fpText
  }

  private consumePrimitive(primitive: PrimitiveSExpr) {
    if (typeof primitive === "string") {
      if (primitive === "unlocked") {
        this.unlocked = true
        return
      }
      if (primitive === "hide") {
        this.hidden = true
        return
      }
      this.addUnknown(primitive)
      return
    }

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

    if (!(parsed instanceof SxClass)) {
      this.addUnknown(primitive)
      return
    }

    this.attachChild(parsed)
  }

  private attachChild(child: SxClass) {
    if (child instanceof At || child instanceof Xy) {
      this._sxPosition = child
      return
    }
    if (child instanceof FpTextUnlocked) {
      this._sxUnlocked = child
      return
    }
    if (child instanceof Layer) {
      this._sxLayer = child
      return
    }
    if (child instanceof FpTextHide) {
      this._sxHide = child
      return
    }
    if (child instanceof TextEffects) {
      this._sxEffects = child
      return
    }
    if (child instanceof Uuid) {
      this._sxUuid = child
      return
    }

    this._additionalChildren.push(child)
  }

  private addUnknown(primitive: PrimitiveSExpr) {
    this._unknownChildren.push(new FpTextUnknown(primitive))
  }

  get type(): FpTextType | undefined {
    return this._type
  }

  set type(value: FpTextType | undefined) {
    this._type = value
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  get position(): At | Xy | undefined {
    return this._sxPosition
  }

  set position(value: At | Xy | undefined) {
    this._sxPosition = value
  }

  get unlocked(): boolean {
    return this._sxUnlocked?.value ?? false
  }

  set unlocked(value: boolean) {
    this._sxUnlocked = value
      ? new FpTextUnlocked({ value: true, bare: true })
      : undefined
  }

  get hidden(): boolean {
    return this._sxHide?.value ?? false
  }

  set hidden(value: boolean) {
    this._sxHide = value
      ? new FpTextHide({ value: true, bare: true })
      : undefined
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

  get unknownChildren(): FpTextUnknownKind[] {
    return [...this._unknownChildren]
  }

  set unknownChildren(children: FpTextUnknownKind[]) {
    this._unknownChildren = [...children]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxUnlocked) children.push(this._sxUnlocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxHide) children.push(this._sxHide)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    children.push(...this._additionalChildren)
    children.push(...this._unknownChildren)
    return children
  }

  override getString(): string {
    const lines = ["(fp_text"]

    if (this._type !== undefined) {
      lines.push(`  ${this._type}`)
    }

    lines.push(`  ${quoteSExprString(this._text)}`)

    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(FpText)

function primitiveToString(value: PrimitiveSExpr | undefined): string {
  if (value === undefined) return ""
  const str = toStringValue(value)
  if (str !== undefined) return str
  return printSExpr(value)
}

class FpTextUnlocked extends SxClass {
  static override token = "unlocked"
  static override parentToken = "fp_text"
  token = "unlocked"

  value: boolean
  private readonly renderBare: boolean

  constructor(options: { value?: boolean; bare?: boolean } = {}) {
    super()
    this.value = options.value ?? true
    this.renderBare = options.bare ?? false
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextUnlocked {
    const [raw] = primitiveSexprs
    const rawString = toStringValue(raw)
    const value = rawString === undefined ? true : !/^(no|false)$/iu.test(rawString)
    return new FpTextUnlocked({ value, bare: false })
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this.renderBare) {
      return "unlocked"
    }
    return `(unlocked ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(FpTextUnlocked)

class FpTextHide extends SxClass {
  static override token = "hide"
  static override parentToken = "fp_text"
  token = "hide"

  value: boolean
  private readonly renderBare: boolean

  constructor(options: { value?: boolean; bare?: boolean } = {}) {
    super()
    this.value = options.value ?? true
    this.renderBare = options.bare ?? false
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpTextHide {
    const [raw] = primitiveSexprs
    const rawString = toStringValue(raw)
    const value = rawString === undefined ? true : !/^(no|false)$/iu.test(rawString)
    return new FpTextHide({ value, bare: false })
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this.renderBare) {
      return "hide"
    }
    return `(hide ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(FpTextHide)

class FpTextUnknown extends SxClass {
  static override token = "__fp_text_unknown__"
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
    return "__fp_text_unknown__"
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
