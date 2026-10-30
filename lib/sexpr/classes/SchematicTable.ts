import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseTableProperties } from "../utils/parseTableProperties"
import { TableBorder } from "./TableBorder"
import { TableCell } from "./TableCell"
import { TableCells } from "./TableCells"
import { TableColumnCount } from "./TableColumnCount"
import { TableColumnWidths } from "./TableColumnWidths"
import { TableLocked } from "./TableLocked"
import { TableRowHeights } from "./TableRowHeights"
import { TableSeparators } from "./TableSeparators"
import { Uuid } from "./Uuid"

export interface SchematicTableConstructorParams {
  columnCount?: number
  border?: TableBorder
  separators?: TableSeparators
  columnWidths?: number[]
  rowHeights?: number[]
  cells?: TableCell[]
  uuid?: Uuid | string
  locked?: boolean
}

export class SchematicTable extends SxClass {
  static override token = "table"
  static override parentToken = "kicad_sch"
  override token = "table"
  private _sxColumnCount?: TableColumnCount
  private _sxBorder?: TableBorder
  private _sxSeparators?: TableSeparators
  private _sxColumnWidths?: TableColumnWidths
  private _sxRowHeights?: TableRowHeights
  private _sxCells?: TableCells
  private _sxUuid?: Uuid
  private _sxLocked?: TableLocked

  constructor(params: SchematicTableConstructorParams = {}) {
    super()
    this.columnCount = params.columnCount
    this.border = params.border
    this.separators = params.separators
    this.columnWidths = params.columnWidths
    this.rowHeights = params.rowHeights
    this.cells = params.cells
    this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): SchematicTable {
    const { propertyMap } = parseTableProperties(primitives, this.token, [
      "column_count",
      "border",
      "separators",
      "column_widths",
      "row_heights",
      "cells",
      "uuid",
      "locked",
    ])
    const table = new SchematicTable()
    table._sxColumnCount = propertyMap.column_count as
      | TableColumnCount
      | undefined
    table._sxBorder = propertyMap.border as TableBorder | undefined
    table._sxSeparators = propertyMap.separators as TableSeparators | undefined
    table._sxColumnWidths = propertyMap.column_widths as
      | TableColumnWidths
      | undefined
    table._sxRowHeights = propertyMap.row_heights as TableRowHeights | undefined
    table._sxCells = propertyMap.cells as TableCells | undefined
    table._sxUuid = propertyMap.uuid as Uuid | undefined
    table._sxLocked = propertyMap.locked as TableLocked | undefined
    return table
  }

  get columnCount(): number | undefined {
    return this._sxColumnCount?.value
  }
  set columnCount(value: number | undefined) {
    this._sxColumnCount =
      value === undefined ? undefined : new TableColumnCount(value)
  }
  get border(): TableBorder | undefined {
    return this._sxBorder
  }
  set border(value: TableBorder | undefined) {
    this._sxBorder = value
  }
  get separators(): TableSeparators | undefined {
    return this._sxSeparators
  }
  set separators(value: TableSeparators | undefined) {
    this._sxSeparators = value
  }
  get columnWidths(): number[] {
    return [...(this._sxColumnWidths?.values ?? [])]
  }
  set columnWidths(value: number[] | undefined) {
    this._sxColumnWidths =
      value === undefined ? undefined : new TableColumnWidths(value)
  }
  get rowHeights(): number[] {
    return [...(this._sxRowHeights?.values ?? [])]
  }
  set rowHeights(value: number[] | undefined) {
    this._sxRowHeights =
      value === undefined ? undefined : new TableRowHeights(value)
  }
  get cells(): TableCell[] {
    return [...(this._sxCells?.cells ?? [])]
  }
  set cells(value: TableCell[] | undefined) {
    this._sxCells = value === undefined ? undefined : new TableCells(value)
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
    this._sxLocked = value === undefined ? undefined : new TableLocked(value)
  }

  override getChildren(): SxClass[] {
    const children: Array<SxClass | undefined> = [
      this._sxColumnCount,
      this._sxBorder,
      this._sxSeparators,
      this._sxColumnWidths,
      this._sxRowHeights,
      this._sxCells,
      this._sxUuid,
      this._sxLocked,
    ]
    return children.filter((child): child is SxClass => child !== undefined)
  }
}
SxClass.register(SchematicTable)
