import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class PadOptions extends SxClass {
  static override token = "options"
  static override parentToken = "pad"
  token = "options"

  private _entries: PrimitiveSExpr[]

  constructor(entries: PrimitiveSExpr[]) {
    super()
    this._entries = entries
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadOptions {
    return new PadOptions([...primitiveSexprs])
  }

  get entries(): PrimitiveSExpr[] {
    return [...this._entries]
  }

  set entries(value: PrimitiveSExpr[]) {
    this._entries = [...value]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._entries.length === 0) {
      return "(options)"
    }
    const lines = ["(options"]
    for (const entry of this._entries) {
      lines.push(`  ${printSExpr(entry)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadOptions)
