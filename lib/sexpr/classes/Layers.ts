import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class Layers extends SxClass {
  static override token = "layers"
  static override rawArgs = true
  token = "layers"

  entries: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.entries = args
  }

  get names(): string[] {
    return this.entries.map((entry) =>
      typeof entry === "string" || typeof entry === "number"
        ? String(entry)
        : printSExpr(entry as PrimitiveSExpr),
    )
  }

  override getString(): string {
    const rendered = this.entries
      .map((entry) =>
        typeof entry === "string" || typeof entry === "number"
          ? String(entry)
          : printSExpr(entry as PrimitiveSExpr),
      )
      .join(" ")
    return `(layers ${rendered})`
  }
}
SxClass.register(Layers)
