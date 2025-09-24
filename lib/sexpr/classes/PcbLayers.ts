import { SxClass } from "../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export interface PcbLayerDefinition {
  index: number | undefined
  name: string | undefined
  type: string | undefined
  userName: string | undefined
  raw: PrimitiveSExpr
}

export class PcbLayers extends SxClass {
  static override token = "layers"
  static override rawArgs = true
  override token = "layers"

  definitions: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.definitions = [...args]
  }

  get layers(): PcbLayerDefinition[] {
    return this.definitions.map((definition) => {
      if (Array.isArray(definition)) {
        const [index, name, type, userName] = definition
        return {
          index: toNumberValue(index as PrimitiveSExpr),
          name: toStringValue(name as PrimitiveSExpr),
          type: toStringValue(type as PrimitiveSExpr),
          userName: toStringValue(userName as PrimitiveSExpr),
          raw: definition as PrimitiveSExpr,
        }
      }
      return {
        index: undefined,
        name: undefined,
        type: undefined,
        userName: undefined,
        raw: definition,
      }
    })
  }

  override getString(): string {
    if (this.definitions.length === 0) {
      return "(layers)"
    }
    const lines = ["(layers"]
    for (const definition of this.definitions) {
      lines.push(`  ${printSExpr(definition)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PcbLayers)
