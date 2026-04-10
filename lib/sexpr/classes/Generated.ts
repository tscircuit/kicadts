import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class Generated extends SxClass {
  static override token = "generated"
  static override parentToken = "kicad_pcb"
  token = "generated"

  private _rawChildren: PrimitiveSExpr[] = []

  constructor() {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Generated {
    const generated = new Generated()
    generated.rawChildren = primitiveSexprs
    return generated
  }

  get rawChildren(): PrimitiveSExpr[] {
    return [...this._rawChildren]
  }

  set rawChildren(value: PrimitiveSExpr[]) {
    this._rawChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = ["(generated"]
    for (const child of this._rawChildren) {
      const rendered = printSExpr(child)
      lines.push(
        ...rendered.split("\n").map((line) => `  ${line}`),
      )
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Generated)
