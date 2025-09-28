import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { quoteSExprString } from "../utils/quoteSExprString"
import { indentLines } from "../utils/indentLines"
import { toStringValue } from "../utils/toStringValue"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { InBom } from "./InBom"
import { OnBoard } from "./OnBoard"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

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

export class SymbolDuplicatePinNumbersAreJumpers extends SxPrimitiveBoolean {
  static override token = "duplicate_pin_numbers_are_jumpers"
  static override parentToken = "symbol"
  token = "duplicate_pin_numbers_are_jumpers"
}
SxClass.register(SymbolDuplicatePinNumbersAreJumpers)

export class SchematicSymbol extends SxClass {
  static override token = "symbol"
  token = "symbol"

  libraryId = ""
  _sxAt?: At
  _sxUnit?: SymbolUnit
  _sxInBom?: InBom
  _sxOnBoard?: OnBoard
  _sxUuid?: Uuid
  _sxDuplicatePinNumbersAreJumpers?: SymbolDuplicatePinNumbersAreJumpers
  properties: SymbolProperty[] = []
  pins: SymbolPin[] = []
  _sxInstances?: SymbolInstances

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

  get inBom(): boolean | undefined {
    return this._sxInBom?.value
  }

  set inBom(value: boolean | undefined) {
    this._sxInBom = value === undefined ? undefined : new InBom(value)
  }

  get onBoard(): boolean | undefined {
    return this._sxOnBoard?.value
  }

  set onBoard(value: boolean | undefined) {
    this._sxOnBoard = value === undefined ? undefined : new OnBoard(value)
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
    const [libraryIdentifier, ...rest] = primitiveSexprs

    const symbol = new SchematicSymbol()
    symbol.libraryId = toStringValue(libraryIdentifier) ?? ""

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(rest, this.token)

    symbol._sxAt = propertyMap.at as At
    symbol._sxUnit = propertyMap.unit as SymbolUnit
    symbol._sxInBom = propertyMap.in_bom as InBom
    symbol._sxOnBoard = propertyMap.on_board as OnBoard
    symbol._sxUuid = propertyMap.uuid as Uuid
    symbol._sxDuplicatePinNumbersAreJumpers =
      propertyMap.duplicate_pin_numbers_are_jumpers as SymbolDuplicatePinNumbersAreJumpers
    symbol.properties = (arrayPropertyMap.property as SymbolProperty[]) ?? []
    symbol.pins = (arrayPropertyMap.pin as SymbolPin[]) ?? []
    symbol._sxInstances = propertyMap.instances as SymbolInstances

    return symbol
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxUnit) children.push(this._sxUnit)
    if (this._sxInBom) children.push(this._sxInBom)
    if (this._sxOnBoard) children.push(this._sxOnBoard)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxDuplicatePinNumbersAreJumpers) {
      children.push(this._sxDuplicatePinNumbersAreJumpers)
    }
    children.push(...this.properties)
    children.push(...this.pins)
    if (this._sxInstances) children.push(this._sxInstances)
    return children
  }

  override getString() {
    const lines = [`(symbol ${quoteSExprString(this.libraryId)}`]

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

    const { propertyMap } =
      SxClass.parsePrimitivesToClassProperties(remaining, this.token)

    symbolPin._sxAt = propertyMap.at as At
    symbolPin._sxLength = propertyMap.length as SymbolPinLength
    symbolPin._sxName = propertyMap.name as SymbolPinName
    symbolPin._sxNumber = propertyMap.number as SymbolPinNumber
    symbolPin._sxUuid = propertyMap.uuid as Uuid

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

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxLength) children.push(this._sxLength)
    if (this._sxName) children.push(this._sxName)
    if (this._sxNumber) children.push(this._sxNumber)
    if (this._sxUuid) children.push(this._sxUuid)
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
