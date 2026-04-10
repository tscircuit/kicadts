import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"

export class GeneratedBaseLine extends SxClass {
  static override token = "base_line"
  static override parentToken = "generated"
  token = "base_line"

  private _sxPts?: Pts

  constructor(pts?: Pts) {
    super()
    this._sxPts = pts
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedBaseLine {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    return new GeneratedBaseLine(propertyMap.pts as Pts | undefined)
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
    const lines = ["(base_line"]
    if (this._sxPts) {
      lines.push(this._sxPts.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GeneratedBaseLine)
