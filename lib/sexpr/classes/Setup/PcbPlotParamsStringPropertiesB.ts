import { SxClass } from "../../base-classes/SxClass"
import { PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamPsA4Output extends PlotParamProperty<string> {
  static override token = "psa4output"
  token = "psa4output"
}
SxClass.register(PlotParamPsA4Output)

export class PlotParamPlotReference extends PlotParamProperty<string> {
  static override token = "plotreference"
  token = "plotreference"
}
SxClass.register(PlotParamPlotReference)

export class PlotParamPlotValue extends PlotParamProperty<string> {
  static override token = "plotvalue"
  token = "plotvalue"
}
SxClass.register(PlotParamPlotValue)

export class PlotParamPlotOtherText extends PlotParamProperty<string> {
  static override token = "plotothertext"
  token = "plotothertext"
}
SxClass.register(PlotParamPlotOtherText)

export class PlotParamPlotInvisibleText extends PlotParamProperty<string> {
  static override token = "plotinvisibletext"
  token = "plotinvisibletext"
}
SxClass.register(PlotParamPlotInvisibleText)

export class PlotParamPadOnSilk extends PlotParamProperty<string> {
  static override token = "padsonsilk"
  token = "padsonsilk"
}
SxClass.register(PlotParamPadOnSilk)

export class PlotParamSketchPadsOnFab extends PlotParamProperty<string> {
  static override token = "sketchpadsonfab"
  token = "sketchpadsonfab"
}
SxClass.register(PlotParamSketchPadsOnFab)

export class PlotParamPlotPadNumbers extends PlotParamProperty<string> {
  static override token = "plotpadnumbers"
  token = "plotpadnumbers"
}
SxClass.register(PlotParamPlotPadNumbers)

export class PlotParamHideDnpOnFab extends PlotParamProperty<string> {
  static override token = "hidednponfab"
  token = "hidednponfab"
}
SxClass.register(PlotParamHideDnpOnFab)

export class PlotParamSketchDnpOnFab extends PlotParamProperty<string> {
  static override token = "sketchdnponfab"
  token = "sketchdnponfab"
}
SxClass.register(PlotParamSketchDnpOnFab)

export class PlotParamCrossoutDnpOnFab extends PlotParamProperty<string> {
  static override token = "crossoutdnponfab"
  token = "crossoutdnponfab"
}
SxClass.register(PlotParamCrossoutDnpOnFab)

export class PlotParamSubtractMaskFromSilk extends PlotParamProperty<string> {
  static override token = "subtractmaskfromsilk"
  token = "subtractmaskfromsilk"
}
SxClass.register(PlotParamSubtractMaskFromSilk)

export class PlotParamPlotBlackAndWhite extends PlotParamProperty<string> {
  static override token = "plot_black_and_white"
  token = "plot_black_and_white"
}
SxClass.register(PlotParamPlotBlackAndWhite)

export class PlotParamMirror extends PlotParamProperty<string> {
  static override token = "mirror"
  token = "mirror"
}
SxClass.register(PlotParamMirror)

export class PlotParamOutputDirectory extends PlotParamProperty<string> {
  static override token = "outputdirectory"
  token = "outputdirectory"
  protected override quoteStringValue = true
}
SxClass.register(PlotParamOutputDirectory)

export class PlotParamPlotOnAllLayers extends PlotParamProperty<string> {
  static override token = "plot_on_all_layers"
  token = "plot_on_all_layers"
}
SxClass.register(PlotParamPlotOnAllLayers)

export class PlotParamPlotInvisible extends PlotParamProperty<string> {
  static override token = "plotinvisible"
  token = "plotinvisible"
}
SxClass.register(PlotParamPlotInvisible)
