import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set([
  "exclude_from_sim",
  "at",
  "effects",
  "uuid",
])

export class SchematicText extends SxClass {
  static override token = "text"
  static override parentToken = "kicad_sch"
  override token = "text"

  private _value = ""
  private _sxExcludeFromSim?: ExcludeFromSim
  private _sxAt?: At
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicText {
    const [textPrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(textPrimitive)
    if (value === undefined) {
      throw new Error("text expects a string value")
    }

    const text = new SchematicText()
    text._value = value

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside text expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child tokens inside text expression: ${token}`,
        )
      }
      if (entries.length > 1) {
        throw new Error(`text does not support repeated child tokens: ${token}`)
      }
    }

    text._sxExcludeFromSim =
      (arrayPropertyMap.exclude_from_sim?.[0] as ExcludeFromSim | undefined) ??
      (propertyMap.exclude_from_sim as ExcludeFromSim | undefined)
    text._sxAt =
      (arrayPropertyMap.at?.[0] as At | undefined) ??
      (propertyMap.at as At | undefined)
    text._sxEffects =
      (arrayPropertyMap.effects?.[0] as TextEffects | undefined) ??
      (propertyMap.effects as TextEffects | undefined)
    text._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)

    return text
  }

  get value(): string {
    return this._value
  }

  set value(newValue: string) {
    this._value = newValue
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

  set at(value: At | undefined) {
    this._sxAt = value
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
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }

  override getString(): string {
    const lines = [`(text ${quoteSExprString(this._value)}`]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SchematicText)
