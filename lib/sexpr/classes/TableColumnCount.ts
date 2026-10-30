import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TableColumnCount extends SxPrimitiveNumber {
  static override token = "column_count"
  static override parentToken = "table"
  override token = "column_count"

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableColumnCount {
    const count = toNumberValue(primitives[0])
    if (
      primitives.length !== 1 ||
      count === undefined ||
      !Number.isInteger(count) ||
      count < 1
    ) {
      throw new Error("table column_count requires a positive integer")
    }
    return new TableColumnCount(count)
  }
}
SxClass.register(TableColumnCount)
