import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export class StackupLayerDielectricModel extends SingleValueProperty<string> {
  static override token = "dielectric_model"
  static override parentToken = "layer"
  token = "dielectric_model"
}
SxClass.register(StackupLayerDielectricModel)
