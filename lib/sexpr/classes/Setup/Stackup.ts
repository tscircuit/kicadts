import { SxClass } from "../../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../../parseToPrimitiveSExpr"

import {
  StackupCastellatedPads,
  StackupCopperFinish,
  StackupDielectricConstraints,
  StackupEdgeConnector,
  StackupEdgePlating,
} from "./StackupProperties"
import { StackupLayer } from "./StackupLayer"

export class Stackup extends SxClass {
  static override token = "stackup"
  static override parentToken = "setup"
  static override rawArgs = true
  token = "stackup"

  layers: StackupLayer[] = []
  copperFinish?: StackupCopperFinish
  dielectricConstraints?: StackupDielectricConstraints
  edgeConnector?: StackupEdgeConnector
  castellatedPads?: StackupCastellatedPads
  edgePlating?: StackupEdgePlating

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

      if (parsed instanceof StackupLayer) {
        this.layers.push(parsed)
        continue
      }
      if (parsed instanceof StackupCopperFinish) {
        this.copperFinish = parsed
        continue
      }
      if (parsed instanceof StackupDielectricConstraints) {
        this.dielectricConstraints = parsed
        continue
      }
      if (parsed instanceof StackupEdgeConnector) {
        this.edgeConnector = parsed
        continue
      }
      if (parsed instanceof StackupCastellatedPads) {
        this.castellatedPads = parsed
        continue
      }
      if (parsed instanceof StackupEdgePlating) {
        this.edgePlating = parsed
        continue
      }
    }
  }

  override getString(): string {
    const lines: string[] = ["(stackup"]
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
SxClass.register(Stackup)

