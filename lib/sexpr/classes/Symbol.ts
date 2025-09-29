import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { quoteSExprString } from "../utils/quoteSExprString"
import { indentLines } from "../utils/indentLines"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Dnp } from "./Dnp"
import { EmbeddedFonts } from "./EmbeddedFonts"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { InBom } from "./InBom"
import { OnBoard } from "./OnBoard"
import { FieldsAutoplaced } from "./FieldsAutoplaced"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"

export class SymbolUnit extends SxPrimitiveNumber {
  static override token = "unit"
  static override parentToken = "symbol"
  token = "unit"

  static from(value: number | SymbolUnit): SymbolUnit {
    if (value instanceof SymbolUnit) {
      return value
    }
    return new SymbolUnit(value)
  }
}
SxClass.register(SymbolUnit)

export class SymbolLibId extends SxClass {
  static override token = "lib_id"
  static override parentToken = "symbol"
  token = "lib_id"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolLibId {
    const [valuePrimitive] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("lib_id expects a string value")
    }
    return new SymbolLibId(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(lib_id ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SymbolLibId)

export class SymbolDuplicatePinNumbersAreJumpers extends SxPrimitiveBoolean {
  static override token = "duplicate_pin_numbers_are_jumpers"
  static override parentToken = "symbol"
  token = "duplicate_pin_numbers_are_jumpers"
}
SxClass.register(SymbolDuplicatePinNumbersAreJumpers)

export class SymbolPinNumbers extends SxClass {
  static override token = "pin_numbers"
  static override parentToken = "symbol"
  token = "pin_numbers"

  private _sxHide?: SymbolPinNumbersHide

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPinNumbers {
    const pinNumbers = new SymbolPinNumbers()
    const primitiveStrings: string[] = []
    const primitiveNodes: PrimitiveSExpr[] = []
    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        primitiveStrings.push(primitive)
        continue
      }
      primitiveNodes.push(primitive)
    }

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveNodes, this.token)

    pinNumbers._sxHide = propertyMap.hide as SymbolPinNumbersHide

    for (const flag of primitiveStrings) {
      if (flag === "hide") {
        pinNumbers._sxHide = new SymbolPinNumbersHide(true, { inline: true })
        continue
      }
      throw new Error(
        `symbol pin_numbers encountered unsupported flag "${flag}"`,
      )
    }

    return pinNumbers
  }

  get hide(): boolean {
    return this._sxHide?.value ?? false
  }

  set hide(value: boolean) {
    this._sxHide = new SymbolPinNumbersHide(value)
  }

  override getChildren(): SxClass[] {
    return this._sxHide ? [this._sxHide] : []
  }
}
SxClass.register(SymbolPinNumbers)

export class SymbolPinNumbersHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "pin_numbers"
  token = "hide"

  private inline = false

  constructor(value?: boolean, options: { inline?: boolean } = {}) {
    super(value ?? true)
    this.inline = options.inline ?? false
  }

  override getString(): string {
    if (this.inline) {
      return this.value ? "hide" : "(hide no)"
    }
    return super.getString()
  }
}
SxClass.register(SymbolPinNumbersHide)

export class SymbolPinNames extends SxClass {
  static override token = "pin_names"
  static override parentToken = "symbol"
  token = "pin_names"

  private _sxOffset?: SymbolPinNamesOffset
  private _sxHide?: SymbolPinNamesHide

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPinNames {
    const pinNames = new SymbolPinNames()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    pinNames._sxOffset = propertyMap.offset as SymbolPinNamesOffset
    pinNames._sxHide = propertyMap.hide as SymbolPinNamesHide

    return pinNames
  }

  get offset(): number | undefined {
    return this._sxOffset?.value
  }

  set offset(value: number | undefined) {
    if (value === undefined) {
      this._sxOffset = undefined
      return
    }
    this._sxOffset = new SymbolPinNamesOffset(value)
  }

  get hide(): boolean {
    return this._sxHide?.value ?? false
  }

  set hide(value: boolean) {
    this._sxHide = new SymbolPinNamesHide(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxOffset) children.push(this._sxOffset)
    if (this._sxHide) children.push(this._sxHide)
    return children
  }
}
SxClass.register(SymbolPinNames)

export class SymbolPinNamesOffset extends SxClass {
  static override token = "offset"
  static override parentToken = "pin_names"
  token = "offset"

  value: number

  constructor(value: number) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPinNamesOffset {
    const [valuePrimitive] = primitiveSexprs
    const value = toNumberValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("pin_names offset expects a numeric value")
    }
    return new SymbolPinNamesOffset(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(offset ${this.value})`
  }
}
SxClass.register(SymbolPinNamesOffset)

export class SymbolPinNamesHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "pin_names"
  token = "hide"
}
SxClass.register(SymbolPinNamesHide)

abstract class SymbolPointBase extends SxClass {
  protected _x: number
  protected _y: number

  constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPointBase {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)
    if (x === undefined || y === undefined) {
      throw new Error(`${this.name} expects two numeric arguments`)
    }
    const Ctor = this as unknown as new (x: number, y: number) => SymbolPointBase
    return new Ctor(x, y)
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  toObject(): { x: number; y: number } {
    return { x: this._x, y: this._y }
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(${this.token} ${this._x} ${this._y})`
  }
}

export class SymbolRectangleStart extends SymbolPointBase {
  static override token = "start"
  static override parentToken = "rectangle"
  token = "start"
}
SxClass.register(SymbolRectangleStart)

export class SymbolRectangleEnd extends SymbolPointBase {
  static override token = "end"
  static override parentToken = "rectangle"
  token = "end"
}
SxClass.register(SymbolRectangleEnd)

export class SymbolArcStart extends SymbolPointBase {
  static override token = "start"
  static override parentToken = "arc"
  token = "start"
}
SxClass.register(SymbolArcStart)

export class SymbolArcMid extends SymbolPointBase {
  static override token = "mid"
  static override parentToken = "arc"
  token = "mid"
}
SxClass.register(SymbolArcMid)

export class SymbolArcEnd extends SymbolPointBase {
  static override token = "end"
  static override parentToken = "arc"
  token = "end"
}
SxClass.register(SymbolArcEnd)

export class SymbolCircleCenter extends SymbolPointBase {
  static override token = "center"
  static override parentToken = "circle"
  token = "center"
}
SxClass.register(SymbolCircleCenter)

export class SymbolCircleRadius extends SxPrimitiveNumber {
  static override token = "radius"
  static override parentToken = "circle"
  token = "radius"
}
SxClass.register(SymbolCircleRadius)

abstract class SymbolFillBase extends SxClass {
  protected _sxType?: SymbolFillType

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolFillBase {
    const fill = new (this as unknown as new () => SymbolFillBase)()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, "fill")
    fill._sxType = propertyMap.type as SymbolFillType
    return fill
  }

  get type(): string | undefined {
    return this._sxType?.value
  }

  set type(value: string | undefined) {
    if (value === undefined) {
      this._sxType = undefined
      return
    }
    this._sxType = new SymbolFillType(value)
  }

  override getChildren(): SxClass[] {
    return this._sxType ? [this._sxType] : []
  }
}

export class SymbolPolylineFill extends SymbolFillBase {
  static override token = "fill"
  static override parentToken = "polyline"
  token = "fill"
}
SxClass.register(SymbolPolylineFill)

export class SymbolRectangleFill extends SymbolFillBase {
  static override token = "fill"
  static override parentToken = "rectangle"
  token = "fill"
}
SxClass.register(SymbolRectangleFill)

export class SymbolCircleFill extends SymbolFillBase {
  static override token = "fill"
  static override parentToken = "circle"
  token = "fill"
}
SxClass.register(SymbolCircleFill)

export class SymbolArcFill extends SymbolFillBase {
  static override token = "fill"
  static override parentToken = "arc"
  token = "fill"
}
SxClass.register(SymbolArcFill)

export class SymbolFillType extends SxClass {
  static override token = "type"
  static override parentToken = "fill"
  token = "type"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolFillType {
    const [valuePrimitive] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("fill type expects a string value")
    }
    return new SymbolFillType(value)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(type ${this.value})`
  }
}
SxClass.register(SymbolFillType)

export class SymbolPolyline extends SxClass {
  static override token = "polyline"
  static override parentToken = "symbol"
  token = "polyline"

  private _sxPts?: Pts
  private _sxStroke?: Stroke
  private _sxFill?: SymbolPolylineFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPolyline {
    const polyline = new SymbolPolyline()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    polyline._sxPts = propertyMap.pts as Pts
    polyline._sxStroke = propertyMap.stroke as Stroke
    polyline._sxFill = propertyMap.fill as SymbolPolylineFill

    return polyline
  }

  get points(): Pts | undefined {
    return this._sxPts
  }

  set points(value: Pts | undefined) {
    this._sxPts = value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): SymbolPolylineFill | undefined {
    return this._sxFill
  }

  set fill(value: SymbolPolylineFill | undefined) {
    this._sxFill = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(SymbolPolyline)

export class SymbolRectangle extends SxClass {
  static override token = "rectangle"
  static override parentToken = "symbol"
  token = "rectangle"

  private _sxStart?: SymbolRectangleStart
  private _sxEnd?: SymbolRectangleEnd
  private _sxStroke?: Stroke
  private _sxFill?: SymbolRectangleFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolRectangle {
    const rectangle = new SymbolRectangle()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    rectangle._sxStart = propertyMap.start as SymbolRectangleStart
    rectangle._sxEnd = propertyMap.end as SymbolRectangleEnd
    rectangle._sxStroke = propertyMap.stroke as Stroke
    rectangle._sxFill = propertyMap.fill as SymbolRectangleFill

    return rectangle
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(SymbolRectangle)

export class SymbolCircle extends SxClass {
  static override token = "circle"
  static override parentToken = "symbol"
  token = "circle"

  private _sxCenter?: SymbolCircleCenter
  private _sxRadius?: SymbolCircleRadius
  private _sxStroke?: Stroke
  private _sxFill?: SymbolCircleFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolCircle {
    const circle = new SymbolCircle()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    circle._sxCenter = propertyMap.center as SymbolCircleCenter
    circle._sxRadius = propertyMap.radius as SymbolCircleRadius
    circle._sxStroke = propertyMap.stroke as Stroke
    circle._sxFill = propertyMap.fill as SymbolCircleFill

    return circle
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxCenter) children.push(this._sxCenter)
    if (this._sxRadius) children.push(this._sxRadius)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(SymbolCircle)

export class SymbolArc extends SxClass {
  static override token = "arc"
  static override parentToken = "symbol"
  token = "arc"

  private _sxStart?: SymbolArcStart
  private _sxMid?: SymbolArcMid
  private _sxEnd?: SymbolArcEnd
  private _sxStroke?: Stroke
  private _sxFill?: SymbolArcFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolArc {
    const arc = new SymbolArc()
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    arc._sxStart = propertyMap.start as SymbolArcStart
    arc._sxMid = propertyMap.mid as SymbolArcMid
    arc._sxEnd = propertyMap.end as SymbolArcEnd
    arc._sxStroke = propertyMap.stroke as Stroke
    arc._sxFill = propertyMap.fill as SymbolArcFill

    return arc
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(SymbolArc)

export class SymbolText extends SxClass {
  static override token = "text"
  static override parentToken = "symbol"
  token = "text"

  private _value = ""
  private _sxAt?: At
  private _sxEffects?: TextEffects

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolText {
    const [valuePrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(valuePrimitive)
    if (value === undefined) {
      throw new Error("text expects a string value")
    }

    const text = new SymbolText()
    text._value = value

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    text._sxAt = propertyMap.at as At
    text._sxEffects = propertyMap.effects as TextEffects

    return text
  }

  get value(): string {
    return this._value
  }

  set value(newValue: string) {
    this._value = newValue
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
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxEffects) children.push(this._sxEffects)
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
SxClass.register(SymbolText)

export class SymbolPower extends SxClass {
  static override token = "power"
  static override parentToken = "symbol"
  token = "power"

  static override fromSexprPrimitives(): SymbolPower {
    return new SymbolPower()
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return "(power)"
  }
}
SxClass.register(SymbolPower)

export class SchematicSymbol extends SxClass {
  static override token = "symbol"
  token = "symbol"

  private _sxLibId?: SymbolLibId
  _sxAt?: At
  _sxUnit?: SymbolUnit
  _sxPinNumbers?: SymbolPinNumbers
  _sxPinNames?: SymbolPinNames
  _sxExcludeFromSim?: ExcludeFromSim
  _sxInBom?: InBom
  _sxOnBoard?: OnBoard
  _sxDnp?: Dnp
  _sxUuid?: Uuid
  _sxDuplicatePinNumbersAreJumpers?: SymbolDuplicatePinNumbersAreJumpers
  _sxFieldsAutoplaced?: FieldsAutoplaced
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  subSymbols: SchematicSymbol[] = []
  polylines: SymbolPolyline[] = []
  rectangles: SymbolRectangle[] = []
  circles: SymbolCircle[] = []
  arcs: SymbolArc[] = []
  texts: SymbolText[] = []
  _sxPower?: SymbolPower
  _sxEmbeddedFonts?: EmbeddedFonts
  _sxInstances?: SymbolInstances
  private _inlineLibId?: string

  get libraryId(): string | undefined {
    return this._sxLibId?.value ?? this._inlineLibId
  }

  set libraryId(value: string | undefined) {
    if (value === undefined || value === "") {
      this._inlineLibId = undefined
      if (this._sxLibId) {
        this._sxLibId = undefined
      }
      return
    }
    this._inlineLibId = value
    this._sxLibId = undefined
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get unit(): number | undefined {
    return this._sxUnit?.value
  }

  set unit(value: number | undefined) {
    this._sxUnit = value === undefined ? undefined : SymbolUnit.from(value)
  }

  get pinNumbers(): SymbolPinNumbers | undefined {
    return this._sxPinNumbers
  }

  set pinNumbers(value: SymbolPinNumbers | undefined) {
    this._sxPinNumbers = value
  }

  get pinNames(): SymbolPinNames | undefined {
    return this._sxPinNames
  }

  set pinNames(value: SymbolPinNames | undefined) {
    this._sxPinNames = value
  }

  get inBom(): boolean | undefined {
    return this._sxInBom?.value
  }

  set inBom(value: boolean | undefined) {
    this._sxInBom = value === undefined ? undefined : new InBom(value)
  }

  get excludeFromSim(): boolean {
    return this._sxExcludeFromSim?.value ?? false
  }

  set excludeFromSim(value: boolean) {
    this._sxExcludeFromSim = new ExcludeFromSim(value)
  }

  get onBoard(): boolean | undefined {
    return this._sxOnBoard?.value
  }

  set onBoard(value: boolean | undefined) {
    this._sxOnBoard = value === undefined ? undefined : new OnBoard(value)
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

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  set uuid(value: string | undefined) {
    this._sxUuid = value === undefined ? undefined : new Uuid(value)
  }

  get duplicatePinNumbersAreJumpers(): boolean {
    return this._sxDuplicatePinNumbersAreJumpers?.value ?? false
  }

  set duplicatePinNumbersAreJumpers(value: boolean | undefined) {
    if (value === undefined) {
      this._sxDuplicatePinNumbersAreJumpers = undefined
      return
    }
    this._sxDuplicatePinNumbersAreJumpers = new SymbolDuplicatePinNumbersAreJumpers(value)
  }

  get instances(): SymbolInstances | undefined {
    return this._sxInstances
  }

  set instances(value: SymbolInstances | undefined) {
    this._sxInstances = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SchematicSymbol {
    const symbol = new SchematicSymbol()

    let remaining = primitiveSexprs
    let inlineId: string | undefined
    if (remaining.length > 0) {
      const first = remaining[0]
      inlineId = toStringValue(first)
      if (inlineId !== undefined) {
        symbol._inlineLibId = inlineId
        remaining = remaining.slice(1)
      }
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(remaining, this.token)

    const libIdClass = propertyMap.lib_id as SymbolLibId | undefined
    if (libIdClass) {
      symbol._sxLibId = libIdClass
    } else if (inlineId !== undefined) {
      symbol._inlineLibId = inlineId
    }
    symbol._sxAt = propertyMap.at as At
    symbol._sxUnit = propertyMap.unit as SymbolUnit
    symbol._sxPinNumbers = propertyMap.pin_numbers as SymbolPinNumbers
    symbol._sxPinNames = propertyMap.pin_names as SymbolPinNames
    symbol._sxExcludeFromSim = propertyMap.exclude_from_sim as ExcludeFromSim
    symbol._sxInBom = propertyMap.in_bom as InBom
    symbol._sxOnBoard = propertyMap.on_board as OnBoard
    symbol._sxDnp = propertyMap.dnp as Dnp
    symbol._sxUuid = propertyMap.uuid as Uuid
    symbol._sxDuplicatePinNumbersAreJumpers =
      propertyMap.duplicate_pin_numbers_are_jumpers as SymbolDuplicatePinNumbersAreJumpers
    symbol._sxFieldsAutoplaced =
      propertyMap.fields_autoplaced as FieldsAutoplaced
    symbol._sxPower = propertyMap.power as SymbolPower
    symbol._sxEmbeddedFonts = propertyMap.embedded_fonts as EmbeddedFonts
    symbol.properties = (arrayPropertyMap.property as SymbolProperty[]) ?? []
    symbol.pins = (arrayPropertyMap.pin as SymbolPin[]) ?? []
    symbol.subSymbols = (arrayPropertyMap.symbol as SchematicSymbol[]) ?? []
    symbol.polylines = (arrayPropertyMap.polyline as SymbolPolyline[]) ?? []
    symbol.rectangles = (arrayPropertyMap.rectangle as SymbolRectangle[]) ?? []
    symbol.circles = (arrayPropertyMap.circle as SymbolCircle[]) ?? []
    symbol.arcs = (arrayPropertyMap.arc as SymbolArc[]) ?? []
    symbol.texts = (arrayPropertyMap.text as SymbolText[]) ?? []
    symbol._sxInstances = propertyMap.instances as SymbolInstances

    return symbol
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxLibId) children.push(this._sxLibId)
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxUnit) children.push(this._sxUnit)
    if (this._sxPinNumbers) children.push(this._sxPinNumbers)
    if (this._sxPinNames) children.push(this._sxPinNames)
    if (this._sxExcludeFromSim) children.push(this._sxExcludeFromSim)
    if (this._sxInBom) children.push(this._sxInBom)
    if (this._sxOnBoard) children.push(this._sxOnBoard)
    if (this._sxDnp) children.push(this._sxDnp)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxDuplicatePinNumbersAreJumpers) {
      children.push(this._sxDuplicatePinNumbersAreJumpers)
    }
    if (this._sxFieldsAutoplaced) children.push(this._sxFieldsAutoplaced)
    children.push(...this.properties)
    children.push(...this.pins)
    children.push(...this.subSymbols)
    children.push(...this.polylines)
    children.push(...this.rectangles)
    children.push(...this.circles)
    children.push(...this.arcs)
    children.push(...this.texts)
    if (this._sxPower) children.push(this._sxPower)
    if (this._sxEmbeddedFonts) children.push(this._sxEmbeddedFonts)
    if (this._sxInstances) children.push(this._sxInstances)
    return children
  }

  override getString() {
    const inlineLibId = this._sxLibId ? undefined : this.libraryId
    const lines =
      inlineLibId !== undefined && inlineLibId !== ""
        ? [`(symbol ${quoteSExprString(inlineLibId)}`]
        : ["(symbol"]

    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SchematicSymbol)

export class SymbolPropertyId extends SxPrimitiveNumber {
  static override token = "id"
  static override parentToken = "property"
  token = "id"

  static from(value: number | SymbolPropertyId): SymbolPropertyId {
    if (value instanceof SymbolPropertyId) {
      return value
    }
    return new SymbolPropertyId(value)
  }
}
SxClass.register(SymbolPropertyId)

export class SymbolProperty extends SxClass {
  static override token = "property"
  static override parentToken = "symbol"
  token = "property"

  key: string
  value: string
  _sxId?: SymbolPropertyId
  _sxAt?: At
  _sxEffects?: TextEffects

  constructor(params: {
    key: string
    value: string
    id?: number | SymbolPropertyId
    at?: At
    effects?: TextEffects
  }) {
    super()
    this.key = params.key
    this.value = params.value
    this._sxId = params.id !== undefined ? SymbolPropertyId.from(params.id) : undefined
    this._sxAt = params.at
    this._sxEffects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolProperty {
    const [inputKey, inputValue, ...rest] = primitiveSexprs

    const key = toStringValue(inputKey) ?? ""
    const value = toStringValue(inputValue) ?? ""

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    return new SymbolProperty({
      key,
      value,
      id: propertyMap.id as SymbolPropertyId,
      at: propertyMap.at as At,
      effects: propertyMap.effects as TextEffects,
    })
  }

  get id(): number | undefined {
    return this._sxId?.value
  }

  set id(value: number | undefined) {
    this._sxId = value === undefined ? undefined : SymbolPropertyId.from(value)
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

  override getString() {
    const lines = [
      `(property ${quoteSExprString(this.key)} ${quoteSExprString(this.value)}`,
    ]

    if (this._sxId) {
      lines.push(...indentLines(this._sxId.getString()))
    }
    if (this._sxAt) {
      lines.push(...indentLines(this._sxAt.getString()))
    }
    if (this._sxEffects) {
      lines.push(...indentLines(this._sxEffects.getString()))
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolProperty)

type PinElectricalType =
  | "input"
  | "output"
  | "bidirectional"
  | "tri_state"
  | "passive"
  | "free"
  | "unspecified"
  | "power_in"
  | "power_out"
  | "open_collector"
  | "open_emitter"
  | "no_connect"

type PinGraphicStyle =
  | "line"
  | "inverted"
  | "clock"
  | "inverted_clock"
  | "input_low"
  | "clock_low"
  | "output_low"
  | "edge_clock_high"
  | "non_logic"

const electricalTypeSet = new Set<PinElectricalType>(["input", "output", "bidirectional", "tri_state", "passive", "free", "unspecified", "power_in", "power_out", "open_collector", "open_emitter", "no_connect"])
const graphicStyleSet = new Set<PinGraphicStyle>(["line", "inverted", "clock", "inverted_clock", "input_low", "clock_low", "output_low", "edge_clock_high", "non_logic"])

export class SymbolPinLength extends SxPrimitiveNumber {
  static override token = "length"
  static override parentToken = "pin"
  token = "length"
}
SxClass.register(SymbolPinLength)

export class SymbolPinName extends SxClass {
  static override token = "name"
  static override parentToken = "pin"
  token = "name"

  value: string
  _sxEffects?: TextEffects

  constructor(params: { value: string; effects?: TextEffects }) {
    super()
    this.value = params.value
    this._sxEffects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPinName {
    const [valuePrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(valuePrimitive) ?? ""
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    return new SymbolPinName({
      value,
      effects: propertyMap.effects as TextEffects,
    })
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  override getChildren(): SxClass[] {
    return this._sxEffects ? [this._sxEffects] : []
  }

  override getString(): string {
    const lines = [`(name ${quoteSExprString(this.value)}`]
    if (this._sxEffects) {
      lines.push(...indentLines(this._sxEffects.getString()))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolPinName)

export class SymbolPinNumber extends SxClass {
  static override token = "number"
  static override parentToken = "pin"
  token = "number"

  value: string
  _sxEffects?: TextEffects

  constructor(params: { value: string; effects?: TextEffects }) {
    super()
    this.value = params.value
    this._sxEffects = params.effects
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolPinNumber {
    const [valuePrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(valuePrimitive) ?? ""
    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    return new SymbolPinNumber({
      value,
      effects: propertyMap.effects as TextEffects,
    })
  }

  get effects(): TextEffects | undefined {
    return this._sxEffects
  }

  set effects(value: TextEffects | undefined) {
    this._sxEffects = value
  }

  override getChildren(): SxClass[] {
    return this._sxEffects ? [this._sxEffects] : []
  }

  override getString(): string {
    const lines = [`(number ${quoteSExprString(this.value)}`]
    if (this._sxEffects) {
      lines.push(...indentLines(this._sxEffects.getString()))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolPinNumber)

export class SymbolPin extends SxClass {
  static override token = "pin"
  static override parentToken = "symbol"
  token = "pin"

  pinElectricalType?: PinElectricalType
  pinGraphicStyle?: PinGraphicStyle
  _sxAt?: At
  _sxLength?: SymbolPinLength
  _sxName?: SymbolPinName
  _sxNumber?: SymbolPinNumber
  _sxUuid?: Uuid
  private inlineNumber?: string
  private _sxHide?: SymbolPinHide

  static override fromSexprPrimitives(args: PrimitiveSExpr[]): SymbolPin {
    const symbolPin = new SymbolPin()

    let index = 0
    const first = args[0]
    const firstString = toStringValue(first)

    if (firstString && electricalTypeSet.has(firstString as PinElectricalType)) {
      symbolPin.pinElectricalType = firstString as PinElectricalType
      index = 1
      const second = args[1]
      const secondString = toStringValue(second)
      if (secondString && graphicStyleSet.has(secondString as PinGraphicStyle)) {
        symbolPin.pinGraphicStyle = secondString as PinGraphicStyle
        index = 2
      }
    } else if (firstString !== undefined && !Array.isArray(first)) {
      symbolPin.inlineNumber = firstString
      index = 1
    }

    const remaining = args.slice(index)

    const primitiveStrings: string[] = []
    const primitiveNodes: PrimitiveSExpr[] = []
    for (const primitive of remaining) {
      if (typeof primitive === "string") {
        primitiveStrings.push(primitive)
        continue
      }
      primitiveNodes.push(primitive)
    }

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveNodes, this.token)

    symbolPin._sxAt = propertyMap.at as At
    symbolPin._sxLength = propertyMap.length as SymbolPinLength
    symbolPin._sxName = propertyMap.name as SymbolPinName
    symbolPin._sxNumber = propertyMap.number as SymbolPinNumber
    symbolPin._sxUuid = propertyMap.uuid as Uuid
    symbolPin._sxHide = propertyMap.hide as SymbolPinHide | undefined

    for (const flag of primitiveStrings) {
      if (flag === "hide") {
        symbolPin._sxHide = new SymbolPinHide(true, { inline: true })
        continue
      }
      throw new Error(`symbol pin encountered unsupported flag "${flag}"`)
    }

    return symbolPin
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get length(): number | undefined {
    return this._sxLength?.value
  }

  set length(value: number | undefined) {
    this._sxLength = value === undefined ? undefined : new SymbolPinLength(value)
  }

  get name(): string | undefined {
    return this._sxName?.value
  }

  set name(value: string | undefined) {
    if (value === undefined) {
      this._sxName = undefined
      return
    }
    this._sxName = new SymbolPinName({ value })
  }

  get numberString(): string | undefined {
    return this._sxNumber?.value ?? this.inlineNumber
  }

  set numberString(value: string | undefined) {
    if (value === undefined) {
      this._sxNumber = undefined
      this.inlineNumber = undefined
      return
    }
    this.inlineNumber = value
    this._sxNumber = undefined
  }

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  set uuid(value: string | undefined) {
    this._sxUuid = value === undefined ? undefined : new Uuid(value)
  }

  get hidden(): boolean {
    return this._sxHide?.value ?? false
  }

  set hidden(value: boolean) {
    this._sxHide = value ? new SymbolPinHide(value) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxLength) children.push(this._sxLength)
    if (this._sxName) children.push(this._sxName)
    if (this._sxNumber) children.push(this._sxNumber)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxHide) children.push(this._sxHide)
    return children
  }

  override getString() {
    if (this.pinElectricalType) {
      const headerParts = ["(pin", this.pinElectricalType]
      if (this.pinGraphicStyle) {
        headerParts.push(this.pinGraphicStyle)
      }
      const lines = [headerParts.join(" ")]
      for (const child of this.getChildren()) {
        lines.push(...indentLines(child.getString()))
      }
      lines.push(")")
      return lines.join("\n")
    }

    const number = this.numberString ?? ""
    const lines = [`(pin ${quoteSExprString(number)}`]
    if (this._sxUuid) {
      lines.push(...indentLines(this._sxUuid.getString()))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolPin)

export class SymbolInstances extends SxClass {
  static override token = "instances"
  static override parentToken = "symbol"
  token = "instances"

  projects: SymbolInstancesProject[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolInstances {
    const symbolInstances = new SymbolInstances()
    const { arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    symbolInstances.projects =
      (arrayPropertyMap.project as SymbolInstancesProject[]) ?? []

    return symbolInstances
  }

  override getChildren(): SxClass[] {
    return [...this.projects]
  }

  override getString() {
    const lines = ["(instances"]
    for (const project of this.projects) {
      lines.push(project.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolInstances)

class SymbolPinHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "pin"
  token = "hide"

  private inline = false

  constructor(value?: boolean, options: { inline?: boolean } = {}) {
    super(value ?? true)
    this.inline = options.inline ?? false
  }

  override getString(): string {
    if (this.inline) {
      return this.value ? "hide" : "(hide no)"
    }
    return this.value ? "(hide yes)" : "(hide no)"
  }
}
SxClass.register(SymbolPinHide)

export class SymbolInstancesProject extends SxClass {
  static override token = "project"
  static override parentToken = "instances"
  token = "project"

  name: string
  paths: SymbolInstancePath[] = []

  constructor(name: string) {
    super()
    this.name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolInstancesProject {
    const [namePrimitive, ...rest] = primitiveSexprs
    const name = toStringValue(namePrimitive) ?? ""
    const project = new SymbolInstancesProject(name)

    const { arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    project.paths = (arrayPropertyMap.path as SymbolInstancePath[]) ?? []

    return project
  }

  override getChildren(): SxClass[] {
    return [...this.paths]
  }

  override getString() {
    const lines = [`(project ${quoteSExprString(this.name)}`]
    for (const path of this.paths) {
      lines.push(path.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolInstancesProject)

export class SymbolInstancePath extends SxClass {
  static override token = "path"
  static override parentToken = "project"
  token = "path"

  value: string
  _sxReference?: SymbolInstanceReference
  _sxUnit?: SymbolInstanceUnit

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolInstancePath {
    const [pathPrimitive, ...rest] = primitiveSexprs
    const value = toStringValue(pathPrimitive) ?? ""
    const path = new SymbolInstancePath(value)

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    path._sxReference = propertyMap.reference as SymbolInstanceReference
    path._sxUnit = propertyMap.unit as SymbolInstanceUnit

    return path
  }

  get reference(): string | undefined {
    return this._sxReference?.value
  }

  set reference(value: string | undefined) {
    this._sxReference = value === undefined ? undefined : new SymbolInstanceReference(value)
  }

  get unit(): number | undefined {
    return this._sxUnit?.value
  }

  set unit(value: number | undefined) {
    this._sxUnit = value === undefined ? undefined : new SymbolInstanceUnit(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxReference) children.push(this._sxReference)
    if (this._sxUnit) children.push(this._sxUnit)
    return children
  }

  override getString() {
    const lines = [`(path ${quoteSExprString(this.value)}`]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(SymbolInstancePath)

export class SymbolInstanceReference extends SxClass {
  static override token = "reference"
  static override parentToken = "path"
  token = "reference"

  value: string

  constructor(value: string) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolInstanceReference {
    const [valuePrimitive] = primitiveSexprs
    return new SymbolInstanceReference(toStringValue(valuePrimitive) ?? "")
  }

  override getString(): string {
    return `(reference ${quoteSExprString(this.value)})`
  }
}
SxClass.register(SymbolInstanceReference)

export class SymbolInstanceUnit extends SxPrimitiveNumber {
  static override token = "unit"
  static override parentToken = "path"
  token = "unit"
}
SxClass.register(SymbolInstanceUnit)
