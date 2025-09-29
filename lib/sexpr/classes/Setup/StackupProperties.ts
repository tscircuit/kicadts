import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

abstract class StackupSingleValueProperty<
  T extends string | number,
> extends SingleValueProperty<T> {
  static override parentToken = "stackup"
}

export class StackupCopperFinish extends StackupSingleValueProperty<string> {
  static override token = "copper_finish"
  token = "copper_finish"
  protected override quoteStringValue = true
}
SxClass.register(StackupCopperFinish)

export class StackupDielectricConstraints extends StackupSingleValueProperty<string> {
  static override token = "dielectric_constraints"
  token = "dielectric_constraints"
}
SxClass.register(StackupDielectricConstraints)

export class StackupEdgeConnector extends StackupSingleValueProperty<string> {
  static override token = "edge_connector"
  token = "edge_connector"
}
SxClass.register(StackupEdgeConnector)

export class StackupCastellatedPads extends StackupSingleValueProperty<string> {
  static override token = "castellated_pads"
  token = "castellated_pads"
}
SxClass.register(StackupCastellatedPads)

export class StackupEdgePlating extends StackupSingleValueProperty<string> {
  static override token = "edge_plating"
  token = "edge_plating"
}
SxClass.register(StackupEdgePlating)
