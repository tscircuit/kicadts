import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { At } from "./At"
import { Color } from "./Color"
import { Dnp } from "./Dnp"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { FieldsAutoplaced } from "./FieldsAutoplaced"
import { InBom } from "./InBom"
import { OnBoard } from "./OnBoard"
import { SheetInstances } from "./SheetInstances"
import { SheetPin } from "./SheetPin"
import { Stroke } from "./Stroke"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { SymbolPropertyId as PropertyId } from "./Symbol"

export class Sheet extends SxClass {
  static override token = "sheet"
  token = "sheet"

  private _sxAt?: At
  private _sxSize?: SheetSize
  private _sxExcludeFromSim?: ExcludeFromSim
  private _sxInBom?: InBom
  private _sxOnBoard?: OnBoard
  private _sxDnp?: Dnp
  private _sxFieldsAutoplaced?: FieldsAutoplaced
  private _sxStroke?: Stroke
  private _sxFill?: SheetFill
  private _sxUuid?: Uuid
  private _properties: SheetProperty[] = []
  private _pins: SheetPin[] = []
  private _sxInstances?: SheetInstances

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Sheet {
    const sheet = new Sheet()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    sheet._sxAt = propertyMap.at as At | undefined
    sheet._sxSize = propertyMap.size as SheetSize | undefined
    sheet._sxExcludeFromSim = propertyMap.exclude_from_sim as ExcludeFromSim | undefined
    sheet._sxInBom = propertyMap.in_bom as InBom | undefined
    sheet._sxOnBoard = propertyMap.on_board as OnBoard | undefined
    sheet._sxDnp = propertyMap.dnp as Dnp | undefined
    sheet._sxFieldsAutoplaced = propertyMap.fields_autoplaced as FieldsAutoplaced | undefined
    sheet._sxStroke = propertyMap.stroke as Stroke | undefined
    sheet._sxFill = propertyMap.fill as SheetFill | undefined
    sheet._sxUuid = propertyMap.uuid as Uuid | undefined
    sheet._properties = (arrayPropertyMap.property as SheetProperty[]) ?? []
    sheet._pins = (arrayPropertyMap.pin as SheetPin[]) ?? []
    sheet._sxInstances = propertyMap.instances as SheetInstances | undefined

    return sheet
  }

  get position(): At | undefined {
    return this._sxAt
  }

  set position(value: At | undefined) {
    this._sxAt = value
  }

  get size(): { width: number; height: number } | undefined {
    return this._sxSize?.toObject()
  }

  set size(value: SheetSize | { width: number; height: number } | undefined) {
    if (value === undefined) {
      this._sxSize = undefined
      return
    }
    if (value instanceof SheetSize) {
      this._sxSize = value
      return
    }
    this._sxSize = new SheetSize(value.width, value.height)
  }

  get excludeFromSim(): boolean {
    return this._sxExcludeFromSim?.value ?? false
  }

  set excludeFromSim(value: boolean) {
    this._sxExcludeFromSim = new ExcludeFromSim(value)
  }

  get inBom(): boolean {
    return this._sxInBom?.value ?? false
  }

  set inBom(value: boolean) {
    this._sxInBom = new InBom(value)
  }

  get onBoard(): boolean {
    return this._sxOnBoard?.value ?? false
  }

  set onBoard(value: boolean) {
    this._sxOnBoard = new OnBoard(value)
  }

  get dnp(): boolean {
    return this._sxDnp?.value ?? false
  }

  set dnp(value: boolean) {
    this._sxDnp = new Dnp(value)
  }

  get fieldsAutoplaced(): boolean {
    return this._sxFieldsAutoplaced?.value ?? false
  }

  set fieldsAutoplaced(value: boolean) {
    this._sxFieldsAutoplaced = new FieldsAutoplaced(value)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SheetFill | undefined {
    return this._sxFill
  }

  set fill(value: SheetFill | undefined) {
    this._sxFill = value
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

  get properties(): SheetProperty[] {
    return this._properties
  }

  set properties(value: SheetProperty[]) {
    this._properties = value
  }

  get pins(): SheetPin[] {
    return this._pins
  }

  set pins(value: SheetPin[]) {
    this._pins = value
  }

  get instances(): SheetInstances | undefined {
    return this._sxInstances
  }

  set instances(value: SheetInstances | undefined) {
    this._sxInstances = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxExcludeFromSim) children.push(this._sxExcludeFromSim)
    if (this._sxInBom) children.push(this._sxInBom)
    if (this._sxOnBoard) children.push(this._sxOnBoard)
    if (this._sxDnp) children.push(this._sxDnp)
    if (this._sxFieldsAutoplaced) children.push(this._sxFieldsAutoplaced)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxUuid) children.push(this._sxUuid)
    children.push(...this._properties)
    children.push(...this._pins)
    if (this._sxInstances) children.push(this._sxInstances)
    return children
  }
}
SxClass.register(Sheet)

export class SheetSize extends SxClass {
  static override token = "size"
  static override parentToken = "sheet"
  token = "size"

  width: number
  height: number

  constructor(width: number, height: number) {
    super()
    this.width = width
    this.height = height
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetSize {
    const width = toNumberValue(primitiveSexprs[0])
    const height = toNumberValue(primitiveSexprs[1])
    if (width === undefined || height === undefined) {
      throw new Error("sheet size requires numeric width and height")
    }
    return new SheetSize(width, height)
  }

  toObject(): { width: number; height: number } {
    return { width: this.width, height: this.height }
  }

  override getString(): string {
    return `(size ${this.width} ${this.height})`
  }
}
SxClass.register(SheetSize)

export class SheetFill extends SxClass {
  static override token = "fill"
  static override parentToken = "sheet"
  token = "fill"

  private _sxColor?: Color

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetFill {
    const fill = new SheetFill()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    fill._sxColor = propertyMap.color as Color | undefined

    return fill
  }

  get color(): Color | undefined {
    return this._sxColor
  }

  set color(value: Color | undefined) {
    this._sxColor = value
  }

  override getChildren(): SxClass[] {
    return this._sxColor ? [this._sxColor] : []
  }
}
SxClass.register(SheetFill)

export class SheetProperty extends SxClass {
  static override token = "property"
  static override parentToken = "sheet"
  token = "property"

  key: string
  value: string
  private _sxId?: PropertyId
  private _sxAt?: At
  private _sxEffects?: TextEffects

  constructor(params: {
    key: string
    value: string
    id?: number | PropertyId
    at?: At
    effects?: TextEffects
  }) {
    super()
    this.key = params.key
    this.value = params.value
    this.id = params.id
    this.at = params.at
    this.effects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SheetProperty {
    const [rawKey, rawValue, ...rest] = primitiveSexprs

    const key = toStringValue(rawKey)
    const value = toStringValue(rawValue)

    if (key === undefined || value === undefined) {
      throw new Error("sheet property requires string key and value")
    }

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      rest,
      this.token,
    )

    return new SheetProperty({
      key,
      value,
      id: propertyMap.id as PropertyId | undefined,
      at: propertyMap.at as At | undefined,
      effects: propertyMap.effects as TextEffects | undefined,
    })
  }

  get id(): number | undefined {
    return this._sxId?.value
  }

  set id(value: number | PropertyId | undefined) {
    if (value === undefined) {
      this._sxId = undefined
      return
    }
    this._sxId = value instanceof PropertyId ? value : new PropertyId(value)
  }

  get idClass(): PropertyId | undefined {
    return this._sxId
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

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxId) children.push(this._sxId)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxEffects) children.push(this._sxEffects)
    return children
  }

  override getString(): string {
    const header = `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`
    const bodyLines = this.getChildren().flatMap((child) =>
      indentLines(child.getString()),
    )

    if (bodyLines.length === 0) {
      return `${header})`
    }

    return [header, ...bodyLines, ")"].join("\n")
  }
}
SxClass.register(SheetProperty)
