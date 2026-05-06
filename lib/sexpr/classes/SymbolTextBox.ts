import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { Stroke } from "./Stroke"
import { TextBoxFill } from "./TextBoxFill"
import { TextBoxSize } from "./TextBoxSize"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "exclude_from_sim",
  "at",
  "size",
  "stroke",
  "fill",
  "effects",
  "uuid",
])

export class SymbolTextBox extends SxClass {
  static override token = "text_box"
  static override parentToken = "symbol"
  override token = "text_box"

  private _text = ""
  private _sxExcludeFromSim?: ExcludeFromSim
  private _sxAt?: At
  private _sxSize?: TextBoxSize
  private _sxStroke?: Stroke
  private _sxFill?: TextBoxFill
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolTextBox {
    const [textPrimitive, ...children] = primitiveSexprs
    const text = toStringValue(textPrimitive)
    if (text === undefined) {
      throw new Error("text_box expects a string value")
    }

    const textBox = new (this as unknown as new () => SymbolTextBox)()
    textBox._text = text

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(children, this.token)

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

    textBox._sxExcludeFromSim = propertyMap.exclude_from_sim as
      | ExcludeFromSim
      | undefined
    textBox._sxAt = propertyMap.at as At | undefined
    textBox._sxSize = propertyMap.size as TextBoxSize | undefined
    textBox._sxStroke = propertyMap.stroke as Stroke | undefined
    textBox._sxFill = propertyMap.fill as TextBoxFill | undefined
    textBox._sxEffects = propertyMap.effects as TextEffects | undefined
    textBox._sxUuid = propertyMap.uuid as Uuid | undefined

    return textBox
  }

  get text(): string {
    return this._text
  }

  set text(value: string) {
    this._text = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxExcludeFromSim) children.push(this._sxExcludeFromSim)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
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
SxClass.register(SymbolTextBox)
