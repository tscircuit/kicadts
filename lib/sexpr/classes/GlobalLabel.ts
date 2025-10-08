import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { FieldsAutoplaced } from "./FieldsAutoplaced"
import { Property } from "./Property"

const SUPPORTED_TOKENS = new Set([
  "shape",
  "at",
  "effects",
  "uuid",
  "fields_autoplaced",
  "property",
])

export type GlobalLabelShape =
  | "input"
  | "output"
  | "bidirectional"
  | "tri_state"
  | "passive"

export interface GlobalLabelConstructorParams {
  value?: string
  shape?: GlobalLabelShape
  at?: AtInput
  effects?: TextEffects
  uuid?: string | Uuid
  fieldsAutoplaced?: boolean | FieldsAutoplaced
  properties?: Property[]
}

export class GlobalLabel extends SxClass {
  static override token = "global_label"
  static override parentToken = "kicad_sch"
  override token = "global_label"

  private _value = ""
  private _shape: GlobalLabelShape = "input"
  private _sxAt?: At
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid
  private _sxFieldsAutoplaced?: FieldsAutoplaced
  private _properties: Property[] = []

  constructor(params: GlobalLabelConstructorParams = {}) {
    super()

    if (params.value !== undefined) {
      this.value = params.value
    }

    if (params.shape !== undefined) {
      this.shape = params.shape
    }

    if (params.at !== undefined) {
      this.at = params.at
    }

    if (params.effects !== undefined) {
      this.effects = params.effects
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }

    if (params.fieldsAutoplaced !== undefined) {
      if (params.fieldsAutoplaced instanceof FieldsAutoplaced) {
        this._sxFieldsAutoplaced = params.fieldsAutoplaced
      } else {
        this.fieldsAutoplaced = params.fieldsAutoplaced
      }
    }

    if (params.properties !== undefined) {
      this.properties = params.properties
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GlobalLabel {
    const [textPrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(textPrimitive)
    if (value === undefined) {
      throw new Error("global_label expects a string value")
    }

    const globalLabel = new GlobalLabel()
    globalLabel._value = value

    // Extract shape before parsing to class properties
    let shapeIndex = -1
    for (let i = 0; i < rest.length; i++) {
      const item = rest[i]
      if (Array.isArray(item) && item[0] === "shape" && item.length === 2) {
        shapeIndex = i
        const shapeValue = toStringValue(item[1])
        if (shapeValue) {
          globalLabel._shape = shapeValue as GlobalLabelShape
        }
        break
      }
    }

    // Remove shape from rest array if found
    const restWithoutShape =
      shapeIndex >= 0 ? rest.filter((_, i) => i !== shapeIndex) : rest

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(restWithoutShape, this.token)

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside global_label expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child tokens inside global_label expression: ${token}`,
        )
      }
      if (token !== "property" && entries.length > 1) {
        throw new Error(
          `global_label does not support repeated child tokens: ${token}`,
        )
      }
    }

    globalLabel._sxAt =
      (arrayPropertyMap.at?.[0] as At | undefined) ??
      (propertyMap.at as At | undefined)
    globalLabel._sxEffects =
      (arrayPropertyMap.effects?.[0] as TextEffects | undefined) ??
      (propertyMap.effects as TextEffects | undefined)
    globalLabel._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)
    globalLabel._sxFieldsAutoplaced =
      (arrayPropertyMap.fields_autoplaced?.[0] as
        | FieldsAutoplaced
        | undefined) ??
      (propertyMap.fields_autoplaced as FieldsAutoplaced | undefined)
    globalLabel._properties =
      (arrayPropertyMap.property as Property[] | undefined) ?? []

    return globalLabel
  }

  get value(): string {
    return this._value
  }

  set value(newValue: string) {
    this._value = newValue
  }

  get shape(): GlobalLabelShape {
    return this._shape
  }

  set shape(value: GlobalLabelShape) {
    this._shape = value
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
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

  get fieldsAutoplaced(): boolean {
    return this._sxFieldsAutoplaced?.value ?? false
  }

  set fieldsAutoplaced(value: boolean) {
    this._sxFieldsAutoplaced = new FieldsAutoplaced(value)
  }

  get properties(): Property[] {
    return [...this._properties]
  }

  set properties(value: Property[]) {
    this._properties = [...value]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxEffects) children.push(this._sxEffects)
    if (this._sxUuid) children.push(this._sxUuid)
    children.push(...this._properties)
    if (this._sxFieldsAutoplaced) children.push(this._sxFieldsAutoplaced)
    return children
  }

  override getString(): string {
    const lines = [`(global_label ${quoteSExprString(this._value)}`]
    lines.push(`  (shape ${this._shape})`)
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GlobalLabel)
