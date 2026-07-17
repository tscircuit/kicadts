import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class ViaTenting extends SxClass {
  static override token = "tenting"
  static override parentToken = "via"
  override token = "tenting"

  sides: string[]

  constructor(sides: string[] = []) {
    super()
    this.sides = sides
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ViaTenting {
    const sides = primitiveSexprs.map((primitive) => {
      const side = toStringValue(primitive)
      if (side === undefined) {
        throw new Error("via tenting expects side name strings")
      }
      return side
    })
    return new ViaTenting(sides)
  }

  override getString(): string {
    return this.sides.length > 0
      ? `(tenting ${this.sides.join(" ")})`
      : "(tenting)"
  }
}
SxClass.register(ViaTenting)
