import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TextBoxMargins extends SxClass {
  static override token = "margins"
  static override parentToken = "text_box"
  override token = "margins"

  constructor(
    public left: number,
    public top: number,
    public right: number,
    public bottom: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextBoxMargins {
    const left = toNumberValue(primitiveSexprs[0])
    const top = toNumberValue(primitiveSexprs[1])
    const right = toNumberValue(primitiveSexprs[2])
    const bottom = toNumberValue(primitiveSexprs[3])
    if (
      left === undefined ||
      top === undefined ||
      right === undefined ||
      bottom === undefined
    ) {
      throw new Error(
        "text_box margins requires four numeric arguments (left, top, right, bottom)",
      )
    }
    return new TextBoxMargins(left, top, right, bottom)
  }

  toObject(): { left: number; top: number; right: number; bottom: number } {
    return {
      left: this.left,
      top: this.top,
      right: this.right,
      bottom: this.bottom,
    }
  }

  override getString(): string {
    return `(margins ${this.left} ${this.top} ${this.right} ${this.bottom})`
  }
}
SxClass.register(TextBoxMargins)
