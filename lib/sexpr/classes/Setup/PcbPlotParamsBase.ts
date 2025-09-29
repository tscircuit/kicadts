import { SxClass } from "../../base-classes/SxClass"

import { SingleValueProperty } from "./base"

export abstract class PlotParamProperty<
  T extends string | number,
> extends SingleValueProperty<T> {
  static override parentToken = "pcbplotparams"
}
