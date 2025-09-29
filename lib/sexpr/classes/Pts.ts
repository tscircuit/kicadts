import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { Xy } from "./Xy"

export class Pts extends SxClass {
  static override token = "pts"
  token = "pts"

  points: Array<Xy>

  constructor(points: Array<Xy> = []) {
    super()
    this.points = points
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Pts {
    const points: Xy[] = []

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `Unexpected primitive inside pts: ${printSExpr(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (parsed instanceof Xy) {
        points.push(parsed)
        continue
      }

      if (parsed instanceof SxClass) {
        throw new Error(
          `Unsupported child "${parsed.token}" inside pts expression`,
        )
      }

      throw new Error(
        `Unable to parse child inside pts: ${printSExpr(primitive)}`,
      )
    }

    return new Pts(points)
  }

  override getChildren(): SxClass[] {
    return [...this.points]
  }

  override getString(): string {
    const lines = ["(pts"]
    for (const point of this.points) {
      const pointString = point.getString()
      const segments = pointString.split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Pts)
