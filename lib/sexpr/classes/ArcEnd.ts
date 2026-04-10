import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class ArcEnd extends SxClass {
  static override token = "end"
  static override parentToken = "arc"
  token = "end"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ArcEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("arc end expects numeric coordinates")
    }
    return new ArcEnd(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(ArcEnd)
