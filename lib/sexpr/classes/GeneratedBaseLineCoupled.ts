import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"

export class GeneratedBaseLineCoupled extends SxClass {
  static override token = "base_line_coupled"
  static override parentToken = "generated"
  token = "base_line_coupled"

  private _sxPts?: Pts

  constructor(pts?: Pts) {
    super()
    this._sxPts = pts
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedBaseLineCoupled {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    return new GeneratedBaseLineCoupled(propertyMap.pts as Pts | undefined)
  }

  get pts(): Pts | undefined {
    return this._sxPts
  }

  set pts(value: Pts | undefined) {
    this._sxPts = value
  }

  override getChildren(): SxClass[] {
    return this._sxPts ? [this._sxPts] : []
  }

  override getString(): string {
    const lines = ["(base_line_coupled"]
    if (this._sxPts) {
      lines.push(this._sxPts.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GeneratedBaseLineCoupled)
