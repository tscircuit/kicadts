import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TableCellSpan extends SxClass {
  static override token = "span"
  static override parentToken = "table_cell"
  override token = "span"

  constructor(
    public columns: number,
    public rows: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableCellSpan {
    const columns = toNumberValue(primitives[0])
    const rows = toNumberValue(primitives[1])
    if (
      primitives.length !== 2 ||
      columns === undefined ||
      rows === undefined
    ) {
      throw new Error("table_cell span requires 2 numeric values")
    }
    return new TableCellSpan(columns, rows)
  }

  override getString(): string {
    return `(span ${this.columns} ${this.rows})`
  }
}
SxClass.register(TableCellSpan)
