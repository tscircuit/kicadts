import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseTableProperties } from "../utils/parseTableProperties"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"
import { At, type AtInput } from "./At"
import { ExcludeFromSim } from "./ExcludeFromSim"
import { Stroke } from "./Stroke"
import { TableCellFill } from "./TableCellFill"
import { TableCellLocked } from "./TableCellLocked"
import { TableCellMargins } from "./TableCellMargins"
import { TableCellSize } from "./TableCellSize"
import { TableCellSpan } from "./TableCellSpan"
import { TextEffects } from "./TextEffects"
import { Uuid } from "./Uuid"

export interface TableCellConstructorParams {
  text?: string
  excludeFromSim?: boolean
  at?: AtInput
  size?: TableCellSize | { width: number; height: number }
  margins?: TableCellMargins
  span?: TableCellSpan
  stroke?: Stroke
  fill?: TableCellFill
  effects?: TextEffects
  uuid?: Uuid | string
  locked?: boolean
}

export class TableCell extends SxClass {
  static override token = "table_cell"
  static override parentToken = "cells"
  override token = "table_cell"

  text = ""
  private _sxExcludeFromSim?: ExcludeFromSim
  private _sxAt?: At
  private _sxSize?: TableCellSize
  private _sxMargins?: TableCellMargins
  private _sxSpan?: TableCellSpan
  private _sxStroke?: Stroke
  private _sxFill?: TableCellFill
  private _sxEffects?: TextEffects
  private _sxUuid?: Uuid
  private _sxLocked?: TableCellLocked

  constructor(params: TableCellConstructorParams = {}) {
    super()
    if (params.text !== undefined) this.text = params.text
    if (params.excludeFromSim !== undefined)
      this.excludeFromSim = params.excludeFromSim
    this.at = params.at
    this.size = params.size
    this.margins = params.margins
    this.span = params.span
    this.stroke = params.stroke
    this.fill = params.fill
    this.effects = params.effects
    this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(primitives: PrimitiveSExpr[]): TableCell {
    const text = toStringValue(primitives[0])
    if (text === undefined) throw new Error("table_cell expects a string value")
    const { propertyMap } = parseTableProperties(
      primitives.slice(1),
      this.token,
      [
        "exclude_from_sim",
        "at",
        "size",
        "margins",
        "span",
        "stroke",
        "fill",
        "effects",
        "uuid",
        "locked",
      ],
    )
    const cell = new TableCell({ text })
    cell._sxExcludeFromSim = propertyMap.exclude_from_sim as
      | ExcludeFromSim
      | undefined
    cell._sxAt = propertyMap.at as At | undefined
    cell._sxSize = propertyMap.size as TableCellSize | undefined
    cell._sxMargins = propertyMap.margins as TableCellMargins | undefined
    cell._sxSpan = propertyMap.span as TableCellSpan | undefined
    cell._sxStroke = propertyMap.stroke as Stroke | undefined
    cell._sxFill = propertyMap.fill as TableCellFill | undefined
    cell._sxEffects = propertyMap.effects as TextEffects | undefined
    cell._sxUuid = propertyMap.uuid as Uuid | undefined
    cell._sxLocked = propertyMap.locked as TableCellLocked | undefined
    return cell
  }

  get excludeFromSim(): boolean {
    return this._sxExcludeFromSim?.value ?? false
  }
  set excludeFromSim(value: boolean | undefined) {
    this._sxExcludeFromSim =
      value === undefined ? undefined : new ExcludeFromSim(value)
  }
  get at(): At | undefined {
    return this._sxAt
  }
  set at(value: AtInput | undefined) {
    this._sxAt = value === undefined ? undefined : At.from(value)
  }
  get size(): TableCellSize | undefined {
    return this._sxSize
  }
  set size(value:
    | TableCellSize
    | { width: number; height: number }
    | undefined) {
    this._sxSize =
      value === undefined || value instanceof TableCellSize
        ? value
        : new TableCellSize(value.width, value.height)
  }
  get margins(): TableCellMargins | undefined {
    return this._sxMargins
  }
  set margins(value: TableCellMargins | undefined) {
    this._sxMargins = value
  }
  get span(): TableCellSpan | undefined {
    return this._sxSpan
  }
  set span(value: TableCellSpan | undefined) {
    this._sxSpan = value
  }
  get stroke(): Stroke | undefined {
    return this._sxStroke
  }
  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }
  get fill(): TableCellFill | undefined {
    return this._sxFill
  }
  set fill(value: TableCellFill | undefined) {
    this._sxFill = value
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
    this._sxUuid =
      value === undefined || value instanceof Uuid ? value : new Uuid(value)
  }
  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }
  set locked(value: boolean | undefined) {
    this._sxLocked =
      value === undefined ? undefined : new TableCellLocked(value)
  }

  override getChildren(): SxClass[] {
    const children: Array<SxClass | undefined> = [
      this._sxExcludeFromSim,
      this._sxAt,
      this._sxSize,
      this._sxMargins,
      this._sxSpan,
      this._sxStroke,
      this._sxFill,
      this._sxEffects,
      this._sxUuid,
      this._sxLocked,
    ]
    return children.filter((child): child is SxClass => child !== undefined)
  }

  override getString(): string {
    return [
      `(table_cell ${quoteSExprString(this.text)}`,
      ...this.getChildren().map((child) => child.getStringIndented()),
      ")",
    ].join("\n")
  }
}
SxClass.register(TableCell)
