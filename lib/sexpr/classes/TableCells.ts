import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseTableProperties } from "../utils/parseTableProperties"
import { TableCell } from "./TableCell"

export class TableCells extends SxClass {
  static override token = "cells"
  static override parentToken = "table"
  override token = "cells"

  constructor(public cells: TableCell[] = []) {
    super()
    this.cells = [...cells]
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableCells {
    const { arrayPropertyMap } = parseTableProperties(
      primitives,
      this.token,
      ["table_cell"],
      ["table_cell"],
    )
    return new TableCells((arrayPropertyMap.table_cell as TableCell[]) ?? [])
  }

  override getChildren(): SxClass[] {
    return [...this.cells]
  }
}
SxClass.register(TableCells)
