import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Layer } from "./Layer"
import { PropertyHide } from "./PropertyHide"
import { PropertyUnlocked } from "./PropertyUnlocked"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Xy } from "./Xy"

const SUPPORTED_SINGLE_CHILDREN = new Set([
  "at",
  "xy",
  "layer",
  "uuid",
  "effects",
  "unlocked",
  "hide",
])

const ensureSingleChild = (
  arrayPropertyMap: Record<string, SxClass[]>,
  token: string,
) => {
  const entries = arrayPropertyMap[token]
  if (entries && entries.length > 1) {
    throw new Error(`property does not support repeated "${token}" children`)
  }
}

const primitiveToString = (value: PrimitiveSExpr | undefined): string | undefined => {
  if (value === undefined) {
    return undefined
  }
  const asString = toStringValue(value)
  if (asString !== undefined) {
    return asString
  }
  return printSExpr(value)
}

export class Property extends SxClass {
  static override token = "property"
  token = "property"

  private _key = ""
  private _value = ""
  private _sxAt?: At
  private _sxXy?: Xy
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxEffects?: TextEffects
  private _sxUnlocked?: PropertyUnlocked
  private _sxHide?: PropertyHide

  constructor(key = "", value = "") {
    super()
    this._key = key
    this._value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Property {
    if (primitiveSexprs.length < 2) {
      throw new Error("property requires key and value arguments")
    }

    const [rawKey, rawValue, ...rest] = primitiveSexprs

    const key = primitiveToString(rawKey)
    const value = primitiveToString(rawValue)
    if (key === undefined) {
      throw new Error("property key must be a printable value")
    }
    if (value === undefined) {
      throw new Error("property value must be a printable value")
    }

    for (const primitive of rest) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `property encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }
      if (primitive.length === 0 || typeof primitive[0] !== "string") {
        throw new Error(
          `property encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }
    }

    const property = new Property(key, value)

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_CHILDREN.has(token)) {
        throw new Error(
          `property encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_CHILDREN.has(token)) {
        throw new Error(
          `property encountered unsupported child token "${token}"`,
        )
      }
      ensureSingleChild(arrayPropertyMap, token)
    }

    const at = propertyMap.at as At | undefined
    const xy = propertyMap.xy as Xy | undefined
    if (at && xy) {
      throw new Error("property can't include both at and xy children")
    }

    property._sxAt = at
    property._sxXy = xy
    property._sxLayer = propertyMap.layer as Layer | undefined
    property._sxUuid = propertyMap.uuid as Uuid | undefined
    property._sxEffects = propertyMap.effects as TextEffects | undefined
    property._sxUnlocked = propertyMap.unlocked as PropertyUnlocked | undefined
    property._sxHide = propertyMap.hide as PropertyHide | undefined

    return property
  }

  get key(): string {
    return this._key
  }

  set key(value: string) {
    this._key = value
  }

  get value(): string {
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  get position(): At | Xy | undefined {
    return this._sxAt ?? this._sxXy
  }

  set position(value: At | Xy | undefined) {
    if (value instanceof At) {
      this._sxAt = value
      this._sxXy = undefined
      return
    }
    if (value instanceof Xy) {
      this._sxXy = value
      this._sxAt = undefined
      return
    }
    this._sxAt = undefined
    this._sxXy = undefined
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | Array<string | number> | string | undefined) {
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

  get unlocked(): boolean {
    return this._sxUnlocked?.value ?? false
  }

  set unlocked(value: boolean) {
    this._sxUnlocked = new PropertyUnlocked(value)
  }

  get hidden(): boolean {
    return this._sxHide?.value ?? false
  }

  set hidden(value: boolean) {
    this._sxHide = new PropertyHide(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxXy) children.push(this._sxXy)
    if (this._sxUnlocked) children.push(this._sxUnlocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxHide) children.push(this._sxHide)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxEffects) children.push(this._sxEffects)
    return children
  }

  override getString(): string {
    const lines = [
      `(property ${quoteSExprString(this._key)} ${quoteSExprString(this._value)}`,
    ]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Property)
