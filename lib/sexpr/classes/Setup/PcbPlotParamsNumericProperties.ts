import { SxClass } from "lib/sexpr/base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { toNumberValue } from "../../utils/toNumberValue"

import { PlotParamProperty } from "./PcbPlotParamsBase"

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

export class PlotParamLayerSelection extends PlotParamProperty<
  string | number
> {
  static override token = "layerselection"
  token = "layerselection"
}
SxClass.register(PlotParamLayerSelection)

export class PlotParamPlotOnAllLayersSelection extends PlotParamProperty<
  string | number
> {
  static override token = "plot_on_all_layers_selection"
  token = "plot_on_all_layers_selection"
}
SxClass.register(PlotParamPlotOnAllLayersSelection)

export class PlotParamDashedLineDashRatio extends PlotParamNumberProperty {
  static override token = "dashed_line_dash_ratio"
  token = "dashed_line_dash_ratio"
}
SxClass.register(PlotParamDashedLineDashRatio)

export class PlotParamDashedLineGapRatio extends PlotParamNumberProperty {
  static override token = "dashed_line_gap_ratio"
  token = "dashed_line_gap_ratio"
}
SxClass.register(PlotParamDashedLineGapRatio)

export class PlotParamSvgPrecision extends PlotParamNumberProperty {
  static override token = "svgprecision"
  token = "svgprecision"
}
SxClass.register(PlotParamSvgPrecision)

export class PlotParamLineWidth extends PlotParamNumberProperty {
  static override token = "linewidth"
  token = "linewidth"
}
SxClass.register(PlotParamLineWidth)

export class PlotParamMode extends PlotParamNumberProperty {
  static override token = "mode"
  token = "mode"
}
SxClass.register(PlotParamMode)

export class PlotParamHpglPenNumber extends PlotParamNumberProperty {
  static override token = "hpglpennumber"
  token = "hpglpennumber"
}
SxClass.register(PlotParamHpglPenNumber)

export class PlotParamHpglPenSpeed extends PlotParamNumberProperty {
  static override token = "hpglpenspeed"
  token = "hpglpenspeed"
}
SxClass.register(PlotParamHpglPenSpeed)

export class PlotParamHpglPenDiameter extends PlotParamNumberProperty {
  static override token = "hpglpendiameter"
  token = "hpglpendiameter"
}
SxClass.register(PlotParamHpglPenDiameter)

export class PlotParamHpglPenOverlay extends PlotParamNumberProperty {
  static override token = "hpglpenoverlay"
  token = "hpglpenoverlay"
}
SxClass.register(PlotParamHpglPenOverlay)

export class PlotParamOutputFormat extends PlotParamNumberProperty {
  static override token = "outputformat"
  token = "outputformat"
}
SxClass.register(PlotParamOutputFormat)

export class PlotParamDrillShape extends PlotParamNumberProperty {
  static override token = "drillshape"
  token = "drillshape"
}
SxClass.register(PlotParamDrillShape)

export class PlotParamScaleSelection extends PlotParamNumberProperty {
  static override token = "scaleselection"
  token = "scaleselection"
}
SxClass.register(PlotParamScaleSelection)
