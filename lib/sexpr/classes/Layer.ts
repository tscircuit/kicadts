import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class Layer extends SxClass {
  static override token = "layer"
  token = "layer"

  private _names: string[] = []

  constructor(names: Array<string | number> = []) {
    super()
    this.names = names.map((name) => String(name))
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Layer {
    const names = primitiveSexprs.map((primitive) =>
      typeof primitive === "string" || typeof primitive === "number"
        ? String(primitive)
        : printSExpr(primitive),
    )
    return new Layer(names)
  }

  get names(): string[] {
    return [...this._names]
  }

  set names(values: Array<string | number>) {
    this._names = values.map((value) => String(value))
  }

  addName(name: string | number) {
    this._names.push(String(name))
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
    return `(layer ${rendered})`
  }
}
SxClass.register(Layer)
