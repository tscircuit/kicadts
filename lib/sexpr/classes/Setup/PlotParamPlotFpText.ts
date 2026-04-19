import { SxClass } from "../../base-classes/SxClass"

import { PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamPlotFpText extends PlotParamProperty<string> {
  static override token = "plotfptext"
  token = "plotfptext"
}
SxClass.register(PlotParamPlotFpText)
