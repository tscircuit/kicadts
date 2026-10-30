import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TableColumnWidths extends SxClass {
  static override token = "column_widths"
  static override parentToken = "table"
  override token = "column_widths"

  constructor(public values: number[] = []) {
    super()
    this.values = [...values]
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableColumnWidths {
    const values = primitives.map((primitive) => {
      const value = toNumberValue(primitive)
      if (value === undefined || !Number.isFinite(value)) {
        throw new Error("column_widths requires numeric values")
      }
      return value
    })
    return new TableColumnWidths(values)
  }

  override getString(): string {
    return `(${this.token}${this.values.length ? ` ${this.values.join(" ")}` : ""})`
  }
}
SxClass.register(TableColumnWidths)
