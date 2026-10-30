import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TableRowHeights extends SxClass {
  static override token = "row_heights"
  static override parentToken = "table"
  override token = "row_heights"

  constructor(public values: number[] = []) {
    super()
    this.values = [...values]
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableRowHeights {
    const values = primitives.map((primitive) => {
      const value = toNumberValue(primitive)
      if (value === undefined || !Number.isFinite(value)) {
        throw new Error("row_heights requires numeric values")
      }
      return value
    })
    return new TableRowHeights(values)
  }

  override getString(): string {
    return `(${this.token}${this.values.length ? ` ${this.values.join(" ")}` : ""})`
  }
}
SxClass.register(TableRowHeights)
