import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Xy } from "./Xy"

export class GeneratedEnd extends SxClass {
  static override token = "end"
  static override parentToken = "generated"
  token = "end"

  private _sxXy?: Xy

  constructor(xy?: Xy) {
    super()
    this._sxXy = xy
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GeneratedEnd {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )
    return new GeneratedEnd(propertyMap.xy as Xy | undefined)
  }

  get xy(): Xy | undefined {
    return this._sxXy
  }

  set xy(value: Xy | undefined) {
    this._sxXy = value
  }

  override getChildren(): SxClass[] {
    return this._sxXy ? [this._sxXy] : []
  }

  override getString(): string {
    const lines = ["(end"]
    if (this._sxXy) {
      lines.push(this._sxXy.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(GeneratedEnd)
