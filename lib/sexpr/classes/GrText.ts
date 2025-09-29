import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Xy } from "./Xy"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

export interface GrTextPosition {
  x: number
  y: number
  angle?: number
}

const SUPPORTED_SINGLE_TOKENS = new Set([
  "at",
  "xy",
  "layer",
  "uuid",
  "effects",
])

export interface GrTextConstructorParams {
  text?: string
  position?: At | Xy | GrTextPosition
  layer?: Layer | string | Array<string | number>
  uuid?: Uuid | string
  effects?: TextEffects
}

export class GrText extends SxClass {
  static override token = "gr_text"
  override token = "gr_text"

  private _text = ""
  private _sxPosition?: At | Xy
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxEffects?: TextEffects

  constructor(params: GrTextConstructorParams | string = {}) {
    super()
    if (typeof params === 'string') {
      this.text = params
    } else {
      if (params.text !== undefined) this.text = params.text
      if (params.position !== undefined) this.position = params.position
      if (params.layer !== undefined) this.layer = params.layer
      if (params.uuid !== undefined) this.uuid = params.uuid
      if (params.effects !== undefined) this.effects = params.effects
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrText {
    if (primitiveSexprs.length === 0) {
      throw new Error("gr_text requires a text argument")
    }

    const [rawText, ...rest] = primitiveSexprs
    const text = toStringValue(rawText)
    if (text === undefined) {
      throw new Error("gr_text text must be a string value")
    }

    const grText = new GrText(text)

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

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
          `gr_text does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_text expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of rest) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `gr_text encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    const atInstance = propertyMap.at as At | undefined
    const xyInstance = propertyMap.xy as Xy | undefined
    if (atInstance && xyInstance) {
      throw new Error("gr_text cannot include both at and xy tokens")
    }

    grText._sxPosition = atInstance ?? xyInstance
    grText._sxLayer = propertyMap.layer as Layer | undefined
    grText._sxUuid = propertyMap.uuid as Uuid | undefined
    grText._sxEffects = propertyMap.effects as TextEffects | undefined

    if (!grText._sxPosition) {
      throw new Error("gr_text requires a position child token")
    }
    if (!grText._sxLayer) {
      throw new Error("gr_text requires a layer child token")
    }
    if (!grText._sxUuid) {
      throw new Error("gr_text requires a uuid child token")
    }
    if (!grText._sxEffects) {
      throw new Error("gr_text requires an effects child token")
    }

    return grText
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

  set position(value: At | Xy | GrTextPosition | undefined,) {
    if (value === undefined) {
      this._sxPosition = undefined
      return
    }
    if (value instanceof At || value instanceof Xy) {
      this._sxPosition = value
      return
    }
    const { x, y, angle } = value
    if (angle !== undefined) {
      this._sxPosition = new At([x, y, angle])
    } else {
      this._sxPosition = new Xy(x, y)
    }
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

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxEffects) children.push(this._sxEffects)
    return children
  }

  override getString(): string {
    const lines = ["(gr_text", `  ${quoteSExprString(this._text)}`]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GrText)
