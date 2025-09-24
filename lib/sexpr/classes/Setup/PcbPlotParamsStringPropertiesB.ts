import { registerPlotParam, PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamPsA4Output extends PlotParamProperty<string> {
  static override token = "psa4output"
  token = "psa4output"
}
registerPlotParam(PlotParamPsA4Output)

export class PlotParamPlotReference extends PlotParamProperty<string> {
  static override token = "plotreference"
  token = "plotreference"
}
registerPlotParam(PlotParamPlotReference)

export class PlotParamPlotValue extends PlotParamProperty<string> {
  static override token = "plotvalue"
  token = "plotvalue"
}
registerPlotParam(PlotParamPlotValue)

export class PlotParamPlotOtherText extends PlotParamProperty<string> {
  static override token = "plotothertext"
  token = "plotothertext"
}
registerPlotParam(PlotParamPlotOtherText)

export class PlotParamPlotInvisibleText extends PlotParamProperty<string> {
  static override token = "plotinvisibletext"
  token = "plotinvisibletext"
}
registerPlotParam(PlotParamPlotInvisibleText)

export class PlotParamPadOnSilk extends PlotParamProperty<string> {
  static override token = "padsonsilk"
  token = "padsonsilk"
}
registerPlotParam(PlotParamPadOnSilk)

export class PlotParamSketchPadsOnFab extends PlotParamProperty<string> {
  static override token = "sketchpadsonfab"
  token = "sketchpadsonfab"
}
registerPlotParam(PlotParamSketchPadsOnFab)

export class PlotParamPlotPadNumbers extends PlotParamProperty<string> {
  static override token = "plotpadnumbers"
  token = "plotpadnumbers"
}
registerPlotParam(PlotParamPlotPadNumbers)

export class PlotParamHideDnpOnFab extends PlotParamProperty<string> {
  static override token = "hidednponfab"
  token = "hidednponfab"
}
registerPlotParam(PlotParamHideDnpOnFab)

export class PlotParamSketchDnpOnFab extends PlotParamProperty<string> {
  static override token = "sketchdnponfab"
  token = "sketchdnponfab"
}
registerPlotParam(PlotParamSketchDnpOnFab)

export class PlotParamCrossoutDnpOnFab extends PlotParamProperty<string> {
  static override token = "crossoutdnponfab"
  token = "crossoutdnponfab"
}
registerPlotParam(PlotParamCrossoutDnpOnFab)

export class PlotParamSubtractMaskFromSilk extends PlotParamProperty<string> {
  static override token = "subtractmaskfromsilk"
  token = "subtractmaskfromsilk"
}
registerPlotParam(PlotParamSubtractMaskFromSilk)

export class PlotParamPlotBlackAndWhite extends PlotParamProperty<string> {
  static override token = "plot_black_and_white"
  token = "plot_black_and_white"
}
registerPlotParam(PlotParamPlotBlackAndWhite)

export class PlotParamMirror extends PlotParamProperty<string> {
  static override token = "mirror"
  token = "mirror"
}
registerPlotParam(PlotParamMirror)

export class PlotParamOutputDirectory extends PlotParamProperty<string> {
  static override token = "outputdirectory"
  token = "outputdirectory"
  protected override quoteStringValue = true
}
registerPlotParam(PlotParamOutputDirectory)

export class PlotParamPlotOnAllLayers extends PlotParamProperty<string> {
  static override token = "plot_on_all_layers"
  token = "plot_on_all_layers"
}
registerPlotParam(PlotParamPlotOnAllLayers)

export class PlotParamPlotInvisible extends PlotParamProperty<string> {
  static override token = "plotinvisible"
  token = "plotinvisible"
}
registerPlotParam(PlotParamPlotInvisible)

