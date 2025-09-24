import { SxClass } from "../../base-classes/SxClass"

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
}
SxClass.register(StackupLayerEpsilonR)

export class StackupLayerLossTangent extends StackupLayerProperty<number> {
  static override token = "loss_tangent"
  token = "loss_tangent"
}
SxClass.register(StackupLayerLossTangent)

