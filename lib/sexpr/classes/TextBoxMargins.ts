import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TextBoxMargins extends SxClass {
  static override token = "margins"
  static override parentToken = "text_box"
  override token = "margins"

  constructor(
    public left = 0,
    public top = 0,
    public right = 0,
    public bottom = 0,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextBoxMargins {
    const values = primitiveSexprs.slice(0, 4).map(toNumberValue)
    if (values.length < 4 || values.some((v) => v === undefined)) {
      throw new Error("text_box margins requires four numeric values")
    }
    const [left, top, right, bottom] = values as [
      number,
      number,
      number,
      number,
    ]
    return new TextBoxMargins(left, top, right, bottom)
  }

  override getString(): string {
    return `(margins ${this.left} ${this.top} ${this.right} ${this.bottom})`
  }
}
SxClass.register(TextBoxMargins)
