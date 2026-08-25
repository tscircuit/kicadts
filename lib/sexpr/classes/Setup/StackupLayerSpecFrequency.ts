import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toNumberValue } from "../../utils/toNumberValue"

import { SingleValueProperty } from "./base"

export class StackupLayerSpecFrequency extends SingleValueProperty<number> {
  static override token = "spec_frequency"
  static override parentToken = "layer"
  token = "spec_frequency"

  protected static override parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): number {
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer spec_frequency expects a numeric value")
    }
    return parsed
  }
}
SxClass.register(StackupLayerSpecFrequency)
