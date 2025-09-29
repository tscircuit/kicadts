import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class PadChamfer extends SxClass {
  static override token = "chamfer"
  static override parentToken = "pad"
  token = "chamfer"

  private _corners: string[] = []

  constructor(corners: string[]) {
    super()
    this.corners = corners
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadChamfer {
    const corners = primitiveSexprs.map((primitive) => {
      const corner = toStringValue(primitive)
      if (corner === undefined) {
        return printSExpr(primitive)
      }
      return corner
    })
    return new PadChamfer(corners)
  }

  get corners(): string[] {
    return [...this._corners]
  }

  set corners(values: string[]) {
    this._corners = values.map((value) => String(value))
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._corners.length === 0) {
      return "(chamfer)"
    }
    return `(chamfer ${this._corners.join(" ")})`
  }
}
SxClass.register(PadChamfer)
