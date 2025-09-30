import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { indentLines } from "../utils/indentLines"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
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
import { SheetFill } from "./SheetFill"
import { SheetSize } from "./SheetSize"
import { SheetProperty } from "./SheetProperty"

export interface SheetConstructorParams {
  position?: AtInput
  size?: SheetSize | { width: number; height: number }
  excludeFromSim?: boolean | ExcludeFromSim
  inBom?: boolean | InBom
  onBoard?: boolean | OnBoard
  dnp?: boolean | Dnp
  fieldsAutoplaced?: boolean | FieldsAutoplaced
  stroke?: Stroke
  fill?: SheetFill
  uuid?: string | Uuid
  properties?: SheetProperty[]
  pins?: SheetPin[]
  instances?: SheetInstances
}

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

  constructor(params: SheetConstructorParams = {}) {
    super()

    if (params.position !== undefined) {
      this.position = params.position
    }

    if (params.size !== undefined) {
      this.size = params.size
    }

    if (params.excludeFromSim !== undefined) {
      this.excludeFromSim = typeof params.excludeFromSim === 'boolean'
        ? params.excludeFromSim
        : params.excludeFromSim.value
    }

    if (params.inBom !== undefined) {
      this.inBom = typeof params.inBom === 'boolean'
        ? params.inBom
        : params.inBom.value
    }

    if (params.onBoard !== undefined) {
      this.onBoard = typeof params.onBoard === 'boolean'
        ? params.onBoard
        : params.onBoard.value
    }

    if (params.dnp !== undefined) {
      this.dnp = typeof params.dnp === 'boolean'
        ? params.dnp
        : params.dnp.value
    }

    if (params.fieldsAutoplaced !== undefined) {
      this.fieldsAutoplaced = typeof params.fieldsAutoplaced === 'boolean'
        ? params.fieldsAutoplaced
        : params.fieldsAutoplaced.value
    }

    if (params.stroke !== undefined) {
      this.stroke = params.stroke
    }

    if (params.fill !== undefined) {
      this.fill = params.fill
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }

    if (params.properties !== undefined) {
      this.properties = params.properties
    }

    if (params.pins !== undefined) {
      this.pins = params.pins
    }

    if (params.instances !== undefined) {
      this.instances = params.instances
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Sheet {
    const sheet = new Sheet()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    sheet._sxAt = propertyMap.at as At | undefined
    sheet._sxSize = propertyMap.size as SheetSize | undefined
    sheet._sxExcludeFromSim = propertyMap.exclude_from_sim as
      | ExcludeFromSim
      | undefined
    sheet._sxInBom = propertyMap.in_bom as InBom | undefined
    sheet._sxOnBoard = propertyMap.on_board as OnBoard | undefined
    sheet._sxDnp = propertyMap.dnp as Dnp | undefined
    sheet._sxFieldsAutoplaced = propertyMap.fields_autoplaced as
      | FieldsAutoplaced
      | undefined
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

  set position(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
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
