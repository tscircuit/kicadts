import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class SymbolArcRadiusAngles extends SxClass {
  static override token = "angles"
  static override parentToken = "radius"
  token = "angles"

  constructor(
    public start: number,
    public end: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): SymbolArcRadiusAngles {
    const [rawStart, rawEnd] = primitiveSexprs
    const start = toNumberValue(rawStart)
    const end = toNumberValue(rawEnd)
    if (start === undefined || end === undefined) {
      throw new Error("symbol arc radius angles expect two numeric arguments")
    }
    return new SymbolArcRadiusAngles(start, end)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(angles ${this.start} ${this.end})`
  }
}
SxClass.register(SymbolArcRadiusAngles)
