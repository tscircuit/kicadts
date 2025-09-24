import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class Zone extends SxClass {
  static override token = "zone"
  static override rawArgs = true
  token = "zone"

  args: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.args = args
  }

  override getString(): string {
    const lines = ["(zone"]

    for (const arg of this.args) {
      lines.push(`  ${printSExpr(arg)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Zone)
