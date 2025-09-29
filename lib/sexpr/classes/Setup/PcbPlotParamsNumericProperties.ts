import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toNumberValue } from "../../utils/toNumberValue"

import { registerPlotParam, PlotParamProperty } from "./PcbPlotParamsBase"

abstract class PlotParamNumberProperty extends PlotParamProperty<number> {
  protected static override parsePrimitiveValue(
    value: PrimitiveSExpr | undefined,
  ): number {
    const parsed = toNumberValue(value)
    if (parsed === undefined) {
      throw new Error(`pcbplotparams ${this.token} expects a numeric value`)
    }
    return parsed
  }
}

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

export class PlotParamDashedLineDashRatio extends PlotParamNumberProperty {
  static override token = "dashed_line_dash_ratio"
  token = "dashed_line_dash_ratio"
}
registerPlotParam(PlotParamDashedLineDashRatio)

export class PlotParamDashedLineGapRatio extends PlotParamNumberProperty {
  static override token = "dashed_line_gap_ratio"
  token = "dashed_line_gap_ratio"
}
registerPlotParam(PlotParamDashedLineGapRatio)

export class PlotParamSvgPrecision extends PlotParamNumberProperty {
  static override token = "svgprecision"
  token = "svgprecision"
}
registerPlotParam(PlotParamSvgPrecision)

export class PlotParamLineWidth extends PlotParamNumberProperty {
  static override token = "linewidth"
  token = "linewidth"
}
registerPlotParam(PlotParamLineWidth)

export class PlotParamMode extends PlotParamNumberProperty {
  static override token = "mode"
  token = "mode"
}
registerPlotParam(PlotParamMode)

export class PlotParamHpglPenNumber extends PlotParamNumberProperty {
  static override token = "hpglpennumber"
  token = "hpglpennumber"
}
registerPlotParam(PlotParamHpglPenNumber)

export class PlotParamHpglPenSpeed extends PlotParamNumberProperty {
  static override token = "hpglpenspeed"
  token = "hpglpenspeed"
}
registerPlotParam(PlotParamHpglPenSpeed)

export class PlotParamHpglPenDiameter extends PlotParamNumberProperty {
  static override token = "hpglpendiameter"
  token = "hpglpendiameter"
}
registerPlotParam(PlotParamHpglPenDiameter)

export class PlotParamHpglPenOverlay extends PlotParamNumberProperty {
  static override token = "hpglpenoverlay"
  token = "hpglpenoverlay"
}
registerPlotParam(PlotParamHpglPenOverlay)

export class PlotParamOutputFormat extends PlotParamNumberProperty {
  static override token = "outputformat"
  token = "outputformat"
}
registerPlotParam(PlotParamOutputFormat)

export class PlotParamDrillShape extends PlotParamNumberProperty {
  static override token = "drillshape"
  token = "drillshape"
}
registerPlotParam(PlotParamDrillShape)

export class PlotParamScaleSelection extends PlotParamNumberProperty {
  static override token = "scaleselection"
  token = "scaleselection"
}
registerPlotParam(PlotParamScaleSelection)
