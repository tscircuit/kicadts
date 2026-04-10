import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class EmbeddedFileData extends SxClass {
  static override token = "data"
  static override parentToken = "file"
  token = "data"
  fragments: string[]

  constructor(fragments: string[]) {
    super()
    this.fragments = fragments
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFileData {
    const fragments = primitiveSexprs.map((p) => {
      const s = toStringValue(p)
      if (s === undefined) {
        throw new Error("embedded file data fragment must be a string")
      }
      return s
    })
    return new EmbeddedFileData(fragments)
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this.fragments.length === 0) return "(data)"
    return `(data ${this.fragments.join(" ")})`
  }
}
SxClass.register(EmbeddedFileData)
