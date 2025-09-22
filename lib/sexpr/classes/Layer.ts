import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class Layer extends SxClass {
  static override token = "layer"
  static override rawArgs = true
  token = "layer"

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

  set names(values: string[]) {
    this.entries = values.map((value) => value)
  }

  override getString(): string {
    const rendered = this.entries
      .map((entry) =>
        typeof entry === "string" || typeof entry === "number"
          ? String(entry)
          : printSExpr(entry as PrimitiveSExpr),
      )
      .join(" ")
    return `(layer ${rendered})`
  }
}
SxClass.register(Layer)
