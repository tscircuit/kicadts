import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class FootprintPrivateLayers extends SxClass {
  static override token = "private_layers"
  static override parentToken = "footprint"
  token = "private_layers"

  private _layers: string[] = []

  constructor(layers: string[]) {
    super()
    this.layers = layers
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FootprintPrivateLayers {
    const layers = primitiveSexprs.map((primitive) => {
      const value = toStringValue(primitive)
      if (value === undefined) {
        throw new Error(
          `private_layers expects string layer names, received ${JSON.stringify(primitive)}`,
        )
      }
      return value
    })
    return new FootprintPrivateLayers(layers)
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
    const rendered = this._layers
      .map((layer) =>
        /^[^\s()"]+$/u.test(layer) && !["nil", "#t", "#f"].includes(layer)
          ? layer
          : quoteSExprString(layer),
      )
      .join(" ")
    return `(private_layers ${rendered})`
  }
}
SxClass.register(FootprintPrivateLayers)
