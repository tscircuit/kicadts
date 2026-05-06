import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"

export class TextBoxSize extends SxClass {
  static override token = "size"
  static override parentToken = "text_box"
  override token = "size"

  constructor(
    public width: number,
    public height: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextBoxSize {
    const width = toNumberValue(primitiveSexprs[0])
    const height = toNumberValue(primitiveSexprs[1])
    if (width === undefined || height === undefined) {
      throw new Error("text_box size requires numeric width and height")
    }
    return new TextBoxSize(width, height)
  }

  override getString(): string {
    return `(size ${this.width} ${this.height})`
  }
}
SxClass.register(TextBoxSize)
