import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class ArcMid extends SxClass {
  static override token = "mid"
  static override parentToken = "arc"
  token = "mid"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ArcMid {
    const [rawX, rawY] = primitiveSexprs
    const x = Number(rawX)
    const y = Number(rawY)
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error("arc mid expects numeric coordinates")
    }
    return new ArcMid(x, y)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(mid ${this.x} ${this.y})`
  }
}
SxClass.register(ArcMid)
