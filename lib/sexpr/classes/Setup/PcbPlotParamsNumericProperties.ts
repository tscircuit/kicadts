import { registerPlotParam, PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamLayerSelection extends PlotParamProperty<string | number> {
  static override token = "layerselection"
  token = "layerselection"
}
registerPlotParam(PlotParamLayerSelection)

export class PlotParamPlotOnAllLayersSelection extends PlotParamProperty<string | number> {
  static override token = "plot_on_all_layers_selection"
  token = "plot_on_all_layers_selection"
}
registerPlotParam(PlotParamPlotOnAllLayersSelection)

export class PlotParamDashedLineDashRatio extends PlotParamProperty<number> {
  static override token = "dashed_line_dash_ratio"
  token = "dashed_line_dash_ratio"
}
registerPlotParam(PlotParamDashedLineDashRatio)

export class PlotParamDashedLineGapRatio extends PlotParamProperty<number> {
  static override token = "dashed_line_gap_ratio"
  token = "dashed_line_gap_ratio"
}
registerPlotParam(PlotParamDashedLineGapRatio)

export class PlotParamSvgPrecision extends PlotParamProperty<number> {
  static override token = "svgprecision"
  token = "svgprecision"
}
registerPlotParam(PlotParamSvgPrecision)

export class PlotParamLineWidth extends PlotParamProperty<number> {
  static override token = "linewidth"
  token = "linewidth"
}
registerPlotParam(PlotParamLineWidth)

export class PlotParamMode extends PlotParamProperty<number> {
  static override token = "mode"
  token = "mode"
}
registerPlotParam(PlotParamMode)

export class PlotParamHpglPenNumber extends PlotParamProperty<number> {
  static override token = "hpglpennumber"
  token = "hpglpennumber"
}
registerPlotParam(PlotParamHpglPenNumber)

export class PlotParamHpglPenSpeed extends PlotParamProperty<number> {
  static override token = "hpglpenspeed"
  token = "hpglpenspeed"
}
registerPlotParam(PlotParamHpglPenSpeed)

export class PlotParamHpglPenDiameter extends PlotParamProperty<number> {
  static override token = "hpglpendiameter"
  token = "hpglpendiameter"
}
registerPlotParam(PlotParamHpglPenDiameter)

export class PlotParamHpglPenOverlay extends PlotParamProperty<number> {
  static override token = "hpglpenoverlay"
  token = "hpglpenoverlay"
}
registerPlotParam(PlotParamHpglPenOverlay)

export class PlotParamOutputFormat extends PlotParamProperty<number> {
  static override token = "outputformat"
  token = "outputformat"
}
registerPlotParam(PlotParamOutputFormat)

export class PlotParamDrillShape extends PlotParamProperty<number> {
  static override token = "drillshape"
  token = "drillshape"
}
registerPlotParam(PlotParamDrillShape)

export class PlotParamScaleSelection extends PlotParamProperty<number> {
  static override token = "scaleselection"
  token = "scaleselection"
}
registerPlotParam(PlotParamScaleSelection)

