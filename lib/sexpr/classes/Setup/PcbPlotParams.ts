import { SxClass } from "../../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../../parseToPrimitiveSExpr"

import "./PcbPlotParamsNumericProperties"
import "./PcbPlotParamsStringPropertiesA"
import "./PcbPlotParamsStringPropertiesB"

export class PcbPlotParams extends SxClass {
  static override token = "pcbplotparams"
  static override parentToken = "setup"
  static override rawArgs = true
  token = "pcbplotparams"

  entries: Array<SxClass | PrimitiveSExpr> = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    for (const arg of args) {
      if (!Array.isArray(arg)) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      let parsed: unknown
      try {
        parsed = SxClass.parsePrimitiveSexpr(arg, { parentToken: this.token })
      } catch (error) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      if (!(parsed instanceof SxClass)) {
        this.entries.push(arg)
        this.extras.push(arg)
        continue
      }

      this.entries.push(parsed)
    }
  }

  override getString(): string {
    const lines: string[] = ["(pcbplotparams"]
    for (const entry of this.entries) {
      if (entry instanceof SxClass) {
        const entryLines = entry.getString().split("\n")
        for (const entryLine of entryLines) {
          lines.push(`  ${entryLine}`)
        }
      } else {
        lines.push(`  ${printSExpr(entry)}`)
      }
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PcbPlotParams)
