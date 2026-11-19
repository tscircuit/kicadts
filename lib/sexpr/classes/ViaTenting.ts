import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { Back } from "./Setup/Back"
import { Front } from "./Setup/Front"

type TentingValue = "yes" | "no" | "none"
export type ViaTentingInput =
  | string[]
  | { front?: TentingValue; back?: TentingValue }

export class ViaTenting extends SxClass {
  static override token = "tenting"
  static override parentToken = "via"
  override token = "tenting"

  sides: string[] = []
  front?: TentingValue
  back?: TentingValue

  constructor(input: ViaTentingInput = []) {
    super()
    if (Array.isArray(input)) {
      this.sides = input
    } else {
      this.front = input.front
      this.back = input.back
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ViaTenting {
    if (primitiveSexprs.some(Array.isArray)) {
      const tenting = new ViaTenting()
      for (const primitive of primitiveSexprs) {
        if (!Array.isArray(primitive) || primitive.length !== 2) {
          throw new Error("via tenting expects per-face overrides")
        }
        const face = SxClass.parsePrimitiveSexpr(primitive, {
          parentToken: this.token,
        })
        if (!(face instanceof Front || face instanceof Back)) {
          throw new Error("via tenting expects front or back")
        }
        const value = face.value
        if (value !== "yes" && value !== "no" && value !== "none") {
          throw new Error("via tenting expects yes, no, or none")
        }
        if (face instanceof Front) tenting.front = value
        else tenting.back = value
      }
      return tenting
    }
    const sides = primitiveSexprs.map((primitive) => {
      const side = toStringValue(primitive)
      if (side === undefined) {
        throw new Error("via tenting expects side name strings")
      }
      return side
    })
    return new ViaTenting(sides)
  }

  override getChildren(): SxClass[] {
    const faces: SxClass[] = []
    if (this.front !== undefined) faces.push(new Front(this.front))
    if (this.back !== undefined) faces.push(new Back(this.back))
    return faces
  }

  override getString(): string {
    if (this.front !== undefined || this.back !== undefined) {
      return super.getString()
    }
    return this.sides.length > 0
      ? `(tenting ${this.sides.join(" ")})`
      : "(tenting)"
  }
}
SxClass.register(ViaTenting)
