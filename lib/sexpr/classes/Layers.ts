import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class Layers extends SxClass {
  static override token = "layers"
  token = "layers"

  private _names: string[] = []

  constructor(names: Array<string | number> = []) {
    super()
    this.names = names
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Layers {
    const names = primitiveSexprs.map((primitive) =>
      typeof primitive === "string" || typeof primitive === "number"
        ? String(primitive)
        : printSExpr(primitive),
    )
    return new Layers(names)
  }

  get names(): string[] {
    return [...this._names]
  }

  set names(values: Array<string | number>) {
    this._names = values.map((value) => String(value))
  }

  override getString(): string {
    const rendered = this._names
      .map((name) => {
        if (/^[^\s()"]+$/u.test(name) && !["nil", "#t", "#f"].includes(name)) {
          return name
        }
        return quoteSExprString(name)
      })
      .join(" ")
    return `(layers ${rendered})`
  }
}
SxClass.register(Layers)
