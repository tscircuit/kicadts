import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TableCellMargins extends SxClass {
  static override token = "margins"
  static override parentToken = "table_cell"
  override token = "margins"

  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): TableCellMargins {
    const left = toNumberValue(primitives[0])
    const top = toNumberValue(primitives[1])
    const right = toNumberValue(primitives[2])
    const bottom = toNumberValue(primitives[3])
    if (
      primitives.length !== 4 ||
      left === undefined ||
      top === undefined ||
      right === undefined ||
      bottom === undefined
    ) {
      throw new Error("table_cell margins requires 4 numeric values")
    }
    return new TableCellMargins(left, top, right, bottom)
  }

  override getString(): string {
    return `(margins ${this.left} ${this.top} ${this.right} ${this.bottom})`
  }
}
SxClass.register(TableCellMargins)
