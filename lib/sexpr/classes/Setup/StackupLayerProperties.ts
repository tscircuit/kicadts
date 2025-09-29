import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toNumberValue } from "../../utils/toNumberValue"

import { SingleValueProperty } from "./base"

abstract class StackupLayerProperty<T extends string | number> extends SingleValueProperty<T> {
  static override parentToken = "layer"
}

export class StackupLayerType extends StackupLayerProperty<string> {
  static override token = "type"
  token = "type"
  protected override quoteStringValue = true
}
SxClass.register(StackupLayerType)

export class StackupLayerColor extends StackupLayerProperty<string> {
  static override token = "color"
  token = "color"
  protected override quoteStringValue = true
}
SxClass.register(StackupLayerColor)

export class StackupLayerThickness extends StackupLayerProperty<number> {
  static override token = "thickness"
  token = "thickness"

  protected static override parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): number {
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer thickness expects a numeric value")
    }
    return parsed
  }
}
SxClass.register(StackupLayerThickness)

export class StackupLayerMaterial extends StackupLayerProperty<string> {
  static override token = "material"
  token = "material"
  protected override quoteStringValue = true
}
SxClass.register(StackupLayerMaterial)

export class StackupLayerEpsilonR extends StackupLayerProperty<number> {
  static override token = "epsilon_r"
  token = "epsilon_r"

  protected static override parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): number {
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer epsilon_r expects a numeric value")
    }
    return parsed
  }
}
SxClass.register(StackupLayerEpsilonR)

export class StackupLayerLossTangent extends StackupLayerProperty<number> {
  static override token = "loss_tangent"
  token = "loss_tangent"

  protected static override parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): number {
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error("Stackup layer loss_tangent expects a numeric value")
    }
    return parsed
  }
}
SxClass.register(StackupLayerLossTangent)
