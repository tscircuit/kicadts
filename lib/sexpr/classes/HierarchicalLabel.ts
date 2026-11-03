import { SxClass } from "../base-classes/SxClass"
import {
  GlobalLabel,
  type GlobalLabelConstructorParams,
  type GlobalLabelShape,
} from "./GlobalLabel"

export type HierarchicalLabelShape = GlobalLabelShape
export type HierarchicalLabelConstructorParams = GlobalLabelConstructorParams

export class HierarchicalLabel extends GlobalLabel {
  static override token = "hierarchical_label"
  static override parentToken = "kicad_sch"
  override token = "hierarchical_label"
}
SxClass.register(HierarchicalLabel)
