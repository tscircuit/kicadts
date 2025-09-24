import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class EmbeddedFonts extends SxClass {
  static override token = "embedded_fonts"
  static override rawArgs = true
  token = "embedded_fonts"

  args: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.args = args
  }

  override getString(): string {
    const rendered = this.args.map((arg) => printSExpr(arg)).join(" ")
    if (rendered.length === 0) {
      return "(embedded_fonts)"
    }
    return `(embedded_fonts ${rendered})`
  }
}
SxClass.register(EmbeddedFonts)
