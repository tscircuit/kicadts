import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class PadPrimitives extends SxClass {
  static override token = "primitives"
  static override parentToken = "pad"
  token = "primitives"

  private _entries: PrimitiveSExpr[]

  constructor(entries: PrimitiveSExpr[]) {
    super()
    this._entries = entries
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitives {
    return new PadPrimitives([...primitiveSexprs])
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
      return "(primitives)"
    }
    const lines = ["(primitives"]
    for (const entry of this._entries) {
      lines.push(`  ${printSExpr(entry)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadPrimitives)
