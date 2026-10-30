import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseTableProperties } from "../utils/parseTableProperties"
import { Stroke } from "./Stroke"
import { TableSeparatorsRows } from "./TableSeparatorsRows"
import { TableSeparatorsColumns } from "./TableSeparatorsColumns"

export interface TableSeparatorsConstructorParams {
  rows?: boolean
  columns?: boolean
  stroke?: Stroke
}

export class TableSeparators extends SxClass {
  static override token = "separators"
  static override parentToken = "table"
  override token = "separators"
  private _sxRows?: TableSeparatorsRows
  private _sxColumns?: TableSeparatorsColumns
  private _sxStroke?: Stroke

  constructor(params: TableSeparatorsConstructorParams = {}) {
    super()
    if (params.rows !== undefined) this.rows = params.rows
    if (params.columns !== undefined) this.columns = params.columns
    this.stroke = params.stroke
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableSeparators {
    const { propertyMap } = parseTableProperties(primitives, this.token, [
      "rows",
      "cols",
      "stroke",
    ])
    const result = new TableSeparators()
    result._sxRows = propertyMap.rows as TableSeparatorsRows | undefined
    result._sxColumns = propertyMap.cols as TableSeparatorsColumns | undefined
    result._sxStroke = propertyMap.stroke as Stroke | undefined
    return result
  }

  get rows(): boolean | undefined {
    return this._sxRows?.value
  }
  set rows(value: boolean | undefined) {
    this._sxRows =
      value === undefined ? undefined : new TableSeparatorsRows(value)
  }

  get columns(): boolean | undefined {
    return this._sxColumns?.value
  }
  set columns(value: boolean | undefined) {
    this._sxColumns =
      value === undefined ? undefined : new TableSeparatorsColumns(value)
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }
  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxRows) children.push(this._sxRows)
    if (this._sxColumns) children.push(this._sxColumns)
    if (this._sxStroke) children.push(this._sxStroke)
    return children
  }
}
SxClass.register(TableSeparators)
