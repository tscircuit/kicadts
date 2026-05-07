import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class ZoneHatch extends SxClass {
  static override token = "hatch"
  static override parentToken = "zone"
  override token = "hatch"

  constructor(
    public style: string,
    public pitch: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneHatch {
    const style = toStringValue(primitiveSexprs[0])
    const pitch = toNumberValue(primitiveSexprs[1])
    if (style === undefined || pitch === undefined) {
      throw new Error("zone hatch requires style and numeric pitch")
    }
    return new ZoneHatch(style, pitch)
  }

  override getString(): string {
    return `(hatch ${this.style} ${this.pitch})`
  }
}
SxClass.register(ZoneHatch)
