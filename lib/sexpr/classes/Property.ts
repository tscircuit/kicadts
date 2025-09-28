import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Layer } from "./Layer"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Xy } from "./Xy"

function primitiveToString(value: PrimitiveSExpr | undefined): string {
  if (value === undefined) return ""
  const str = toStringValue(value)
  if (str !== undefined) return str
  return printSExpr(value)
}

export class Property extends SxClass {
  static override token = "property"
  token = "property"

  key = ""
  value = ""

  private _sxPosition?: At | Xy
  private _sxLayer?: Layer
  private _sxUuid?: Uuid
  private _sxEffects?: TextEffects
  private _sxUnlocked?: PropertyUnlocked
  private _sxHide?: PropertyHide
  private _additionalChildren: SxClass[] = []
  private _unknownChildren: PropertyUnknown[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Property {
    const [rawKey, rawValue, ...rest] = primitiveSexprs
    const property = new Property()

    property.key = primitiveToString(rawKey)
    property.value = primitiveToString(rawValue)

    for (const primitive of rest) {
      property.consumePrimitive(primitive)
    }

    return property
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
    if (child instanceof PropertyUnlocked) {
      this._sxUnlocked = child
      return
    }
    if (child instanceof Layer) {
      this._sxLayer = child
      return
    }
    if (child instanceof PropertyHide) {
      this._sxHide = child
      return
    }
    if (child instanceof Uuid) {
      this._sxUuid = child
      return
    }
    if (child instanceof TextEffects) {
      this._sxEffects = child
      return
    }

    this._additionalChildren.push(child)
  }

  private addUnknown(primitive: PrimitiveSExpr) {
    this._unknownChildren.push(new PropertyUnknown(primitive))
  }

  get position(): At | Xy | undefined {
    return this._sxPosition
  }

  set position(value: At | Xy | undefined) {
    this._sxPosition = value
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | undefined) {
    this._sxLayer = value
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | undefined) {
    this._sxUuid = value
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
    if (value) {
      this._sxUnlocked = new PropertyUnlocked(true)
    } else {
      this._sxUnlocked = undefined
    }
  }

  get unlockedClass(): PropertyUnlocked | undefined {
    return this._sxUnlocked
  }

  get unlockedProperty(): boolean {
    return this.unlocked
  }

  set unlockedProperty(value: boolean) {
    this.unlocked = value
  }

  get hidden(): boolean {
    return this._sxHide?.value ?? false
  }

  set hidden(value: boolean) {
    if (value) {
      this._sxHide = new PropertyHide(true)
    } else {
      this._sxHide = undefined
    }
  }

  get hiddenClass(): PropertyHide | undefined {
    return this._sxHide
  }

  get hiddenProperty(): boolean {
    return this.hidden
  }

  set hiddenProperty(value: boolean) {
    this.hidden = value
  }

  get additionalChildren(): SxClass[] {
    return [...this._additionalChildren]
  }

  set additionalChildren(children: SxClass[]) {
    this._additionalChildren = [...children]
  }

  get unknownChildren(): PropertyUnknown[] {
    return [...this._unknownChildren]
  }

  set unknownChildren(children: PropertyUnknown[]) {
    this._unknownChildren = [...children]
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPosition) children.push(this._sxPosition)
    if (this._sxUnlocked?.value) children.push(this._sxUnlocked)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxHide?.value) children.push(this._sxHide)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxEffects) children.push(this._sxEffects)
    children.push(...this._additionalChildren)
    children.push(...this._unknownChildren)
    return children
  }

  override getString(): string {
    const lines = [
      `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`,
    ]

    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Property)

export class PropertyUnlocked extends SxPrimitiveBoolean {
  static override token = "unlocked"
  static override parentToken = "property"
  token = "unlocked"

  constructor(value: boolean) {
    super(value)
  }
}
SxClass.register(PropertyUnlocked)

export class PropertyHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "property"
  token = "hide"

  constructor(value: boolean) {
    super(value)
  }
}
SxClass.register(PropertyHide)

class PropertyUnknown extends SxClass {
  static override token = "__property_unknown__"
  token: string
  private readonly primitive: PrimitiveSExpr

  constructor(primitive: PrimitiveSExpr) {
    super()
    this.primitive = primitive
    this.token = this.resolveToken(primitive)
  }

  private resolveToken(primitive: PrimitiveSExpr): string {
    if (typeof primitive === "string") {
      return primitive
    }
    if (Array.isArray(primitive) && primitive.length > 0) {
      const [token] = primitive
      if (typeof token === "string") {
        return token
      }
    }
    return "__property_unknown__"
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
