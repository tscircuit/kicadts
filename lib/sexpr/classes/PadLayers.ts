import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class PadLayers extends SxClass {
  static override token = "layers"
  static override parentToken = "pad"
  token = "layers"

  private _layers: string[] = []

  constructor(layers: string[]) {
    super()
    this.layers = layers
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadLayers {
    const layers = primitiveSexprs.map((primitive) => {
      const value = toStringValue(primitive)
      if (value === undefined) {
        return printSExpr(primitive)
      }
      return value
    })
    return new PadLayers(layers)
  }

  get layers(): string[] {
    return [...this._layers]
  }

  set layers(values: string[]) {
    this._layers = values.map((value) => String(value))
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._layers.length === 0) {
      return "(layers)"
    }
    const rendered = this._layers
      .map((layer) => {
        if (/^[^\s()"]+$/u.test(layer) && !["nil", "#t", "#f"].includes(layer)) {
          return layer
        }
        return quoteSExprString(layer)
      })
      .join(" ")
    return `(layers ${rendered})`
  }
}
SxClass.register(PadLayers)
