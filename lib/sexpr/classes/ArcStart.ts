import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class ArcStart extends SxClass {
  static override token = "start"
  static override parentToken = "arc"
  token = "start"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ArcStart {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("arc start expects numeric coordinates")
    }
    return new ArcStart(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(ArcStart)
