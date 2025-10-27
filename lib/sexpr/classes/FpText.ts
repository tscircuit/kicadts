import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Tstamp } from "./Tstamp"
import { Xy } from "./Xy"

export type FpTextType = "reference" | "value" | "user" | string

const SUPPORTED_SINGLE_TOKENS = new Set([
  "at",
  "xy",
  "layer",
  "effects",
  "tstamp",
  "uuid",
  "unlocked",
  "hide",
])

const SUPPORTED_MULTI_TOKENS = new Set<string>()

export interface FpTextConstructorParams {
  type?: FpTextType
  text?: string
  position?: AtInput | Xy
  unlocked?: boolean
  hidden?: boolean
  layer?: Layer | string | string[]
  effects?: TextEffects
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

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
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: FpTextConstructorParams = {}) {
    super()
    if (params.type !== undefined) this.type = params.type
    if (params.text !== undefined) this.text = params.text
    if (params.position !== undefined) this.position = params.position
    if (params.unlocked !== undefined) this.unlocked = params.unlocked
    if (params.hidden !== undefined) this.hidden = params.hidden
    if (params.layer !== undefined) this.layer = params.layer
    if (params.effects !== undefined) this.effects = params.effects
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpText {
    if (primitiveSexprs.length < 2) {
      throw new Error("fp_text requires a type and text value")
    }

    const [rawType, rawText, ...rest] = primitiveSexprs
    const fpText = new FpText()

    if (typeof rawType !== "string") {
      throw new Error(
        `fp_text type must be a string token, received ${JSON.stringify(rawType)}`,
      )
    }
    fpText._type = rawType

    fpText._text = primitiveToString(rawText)

    const structuredPrimitives: PrimitiveSExpr[] = []
    let sawBareUnlocked = false
    let sawBareHide = false

    for (const primitive of rest) {
      if (typeof primitive === "string") {
        if (primitive === "unlocked") {
          if (sawBareUnlocked) {
            throw new Error(
              "fp_text encountered duplicate bare unlocked tokens",
            )
          }
          sawBareUnlocked = true
          continue
        }
        if (primitive === "hide") {
          if (sawBareHide) {
            throw new Error("fp_text encountered duplicate bare hide tokens")
          }
          sawBareHide = true
          continue
        }
        throw new Error(`fp_text encountered unsupported flag "${primitive}"`)
      }

      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `fp_text encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      structuredPrimitives.push(primitive)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(structuredPrimitives, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `fp_text encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `fp_text encountered unsupported child token "${token}"`,
        )
      }
      if (!SUPPORTED_MULTI_TOKENS.has(token) && entries.length > 1) {
        throw new Error(
          `fp_text does not support repeated child token "${token}"`,
        )
      }
    }

    const atInstance = propertyMap.at as At | undefined
    const xyInstance = propertyMap.xy as Xy | undefined
    if (atInstance && xyInstance) {
      throw new Error("fp_text cannot include both at and xy child tokens")
    }

    fpText._sxPosition = atInstance ?? xyInstance
    fpText._sxLayer = propertyMap.layer as Layer | undefined
    fpText._sxEffects = propertyMap.effects as TextEffects | undefined
    fpText._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    fpText._sxUuid = propertyMap.uuid as Uuid | undefined

    const unlockedEntry = propertyMap.unlocked as FpTextUnlocked | undefined
    const hideEntry = propertyMap.hide as FpTextHide | undefined

    if (unlockedEntry && sawBareUnlocked) {
      throw new Error(
        "fp_text encountered both bare and structured unlocked tokens",
      )
    }
    if (hideEntry && sawBareHide) {
      throw new Error(
        "fp_text encountered both bare and structured hide tokens",
      )
    }

    fpText._sxUnlocked = unlockedEntry
    fpText._sxHide = hideEntry

    if (sawBareUnlocked) {
      fpText._sxUnlocked = new FpTextUnlocked({ value: true, bare: true })
    }
    if (sawBareHide) {
      fpText._sxHide = new FpTextHide({ value: true, bare: true })
    }

    return fpText
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

  set position(value: AtInput | Xy | undefined) {
    if (value === undefined) {
      this._sxPosition = undefined
      return
    }
    if (value instanceof Xy) {
      this._sxPosition = value
      return
    }
    // Handle AtInput (At, array, or object)
    this._sxPosition = At.from(value as AtInput)
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
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxUnlocked) children.push(this._sxUnlocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxHide) children.push(this._sxHide)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
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
    const value =
      rawString === undefined ? true : !/^(no|false)$/iu.test(rawString)
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
    const value =
      rawString === undefined ? true : !/^(no|false)$/iu.test(rawString)
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
