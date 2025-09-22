import { SxClass } from "../base-classes/SxClass"
import type { Xy } from "./Xy"

export class Pts extends SxClass {
  static override token = "pts"
  token = "pts"

  points: Array<Xy>

  constructor(args: Array<Xy>, opts?: {}) {
    super()
    this.points = args
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
