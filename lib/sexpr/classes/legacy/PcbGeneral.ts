import { SxClass } from "../../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toNumberValue } from "../../utils/toNumberValue"

export class PcbGeneral extends SxClass {
  static override token = "general"
  static override rawArgs = true
  override token = "general"

  entries: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.entries = [...args]
  }

  get thickness(): number | undefined {
    for (const entry of this.entries) {
      if (
        Array.isArray(entry) &&
        entry.length > 1 &&
        entry[0] === "thickness"
      ) {
        return toNumberValue(entry[1] as PrimitiveSExpr)
      }
    }
    return undefined
  }

  set thickness(value: number | undefined) {
    const index = this.entries.findIndex(
      (entry) => Array.isArray(entry) && entry[0] === "thickness",
    )
    if (value === undefined) {
      if (index !== -1) {
        this.entries.splice(index, 1)
      }
      return
    }
    const newEntry: PrimitiveSExpr = ["thickness", value]
    if (index !== -1) {
      this.entries[index] = newEntry
    } else {
      this.entries.push(newEntry)
    }
  }

  override getString(): string {
    if (this.entries.length === 0) {
      return "(general)"
    }
    const lines = ["(general"]
    for (const entry of this.entries) {
      lines.push(`  ${printSExpr(entry)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PcbGeneral)
