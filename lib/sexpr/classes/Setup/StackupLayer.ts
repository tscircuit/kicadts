import { SxClass } from "../../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../../parseToPrimitiveSExpr"
import { quoteSExprString } from "../../utils/quoteSExprString"

import {
  StackupLayerColor,
  StackupLayerEpsilonR,
  StackupLayerLossTangent,
  StackupLayerMaterial,
  StackupLayerThickness,
  StackupLayerType,
} from "./StackupLayerProperties"

export class StackupLayer extends SxClass {
  static override token = "layer"
  static override parentToken = "stackup"
  static override rawArgs = true
  token = "layer"

  name: string
  number?: number

  type?: StackupLayerType
  color?: StackupLayerColor
  thickness?: StackupLayerThickness
  material?: StackupLayerMaterial
  epsilonR?: StackupLayerEpsilonR
  lossTangent?: StackupLayerLossTangent

  entries: Array<SxClass | PrimitiveSExpr> = []
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()
    if (args.length === 0 || typeof args[0] !== "string") {
      throw new Error("Stackup layer requires a layer name")
    }
    this.name = args[0]

    let index = 1
    if (typeof args[index] === "number") {
      this.number = args[index] as number
      index += 1
    }

    for (; index < args.length; index += 1) {
      const entry = args[index]
      if (!Array.isArray(entry)) {
        this.entries.push(entry)
        this.extras.push(entry)
        continue
      }

      let parsed: unknown
      try {
        parsed = SxClass.parsePrimitiveSexpr(entry, { parentToken: this.token })
      } catch (error) {
        this.entries.push(entry)
        this.extras.push(entry)
        continue
      }

      if (!(parsed instanceof SxClass)) {
        this.entries.push(entry)
        this.extras.push(entry)
        continue
      }

      this.entries.push(parsed)

      if (parsed instanceof StackupLayerType) {
        this.type = parsed
        continue
      }
      if (parsed instanceof StackupLayerColor) {
        this.color = parsed
        continue
      }
      if (parsed instanceof StackupLayerThickness) {
        this.thickness = parsed
        continue
      }
      if (parsed instanceof StackupLayerMaterial) {
        this.material = parsed
        continue
      }
      if (parsed instanceof StackupLayerEpsilonR) {
        this.epsilonR = parsed
        continue
      }
      if (parsed instanceof StackupLayerLossTangent) {
        this.lossTangent = parsed
        continue
      }
    }
  }

  override getString(): string {
    const headerParts = [`(layer ${quoteSExprString(this.name)}`]
    if (this.number !== undefined) {
      headerParts[0] += ` ${this.number}`
    }

    if (this.entries.length === 0) {
      return `${headerParts[0]})`
    }

    const lines: string[] = [headerParts[0]]
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
SxClass.register(StackupLayer)

