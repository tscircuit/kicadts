import { registerPlotParam, PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamDisableApertMacros extends PlotParamProperty<string> {
  static override token = "disableapertmacros"
  token = "disableapertmacros"
}
registerPlotParam(PlotParamDisableApertMacros)

export class PlotParamUseGerberExtensions extends PlotParamProperty<string> {
  static override token = "usegerberextensions"
  token = "usegerberextensions"
}
registerPlotParam(PlotParamUseGerberExtensions)

export class PlotParamUseGerberAttributes extends PlotParamProperty<string> {
  static override token = "usegerberattributes"
  token = "usegerberattributes"
}
registerPlotParam(PlotParamUseGerberAttributes)

export class PlotParamUseGerberAdvancedAttributes extends PlotParamProperty<string> {
  static override token = "usegerberadvancedattributes"
  token = "usegerberadvancedattributes"
}
registerPlotParam(PlotParamUseGerberAdvancedAttributes)

export class PlotParamCreateGerberJobFile extends PlotParamProperty<string> {
  static override token = "creategerberjobfile"
  token = "creategerberjobfile"
}
registerPlotParam(PlotParamCreateGerberJobFile)

export class PlotParamExcludeEdgeLayer extends PlotParamProperty<string> {
  static override token = "excludeedgelayer"
  token = "excludeedgelayer"
}
registerPlotParam(PlotParamExcludeEdgeLayer)

export class PlotParamPlotFrameRef extends PlotParamProperty<string> {
  static override token = "plotframeref"
  token = "plotframeref"
}
registerPlotParam(PlotParamPlotFrameRef)

export class PlotParamViaOnMask extends PlotParamProperty<string> {
  static override token = "viasonmask"
  token = "viasonmask"
}
registerPlotParam(PlotParamViaOnMask)

export class PlotParamUseAuxOrigin extends PlotParamProperty<string> {
  static override token = "useauxorigin"
  token = "useauxorigin"
}
registerPlotParam(PlotParamUseAuxOrigin)

export class PlotParamPdfFrontFpPropertyPopups extends PlotParamProperty<string> {
  static override token = "pdf_front_fp_property_popups"
  token = "pdf_front_fp_property_popups"
}
registerPlotParam(PlotParamPdfFrontFpPropertyPopups)

export class PlotParamPdfBackFpPropertyPopups extends PlotParamProperty<string> {
  static override token = "pdf_back_fp_property_popups"
  token = "pdf_back_fp_property_popups"
}
registerPlotParam(PlotParamPdfBackFpPropertyPopups)

export class PlotParamPdfMetadata extends PlotParamProperty<string> {
  static override token = "pdf_metadata"
  token = "pdf_metadata"
}
registerPlotParam(PlotParamPdfMetadata)

export class PlotParamPdfSingleDocument extends PlotParamProperty<string> {
  static override token = "pdf_single_document"
  token = "pdf_single_document"
}
registerPlotParam(PlotParamPdfSingleDocument)

export class PlotParamDxfPolygonMode extends PlotParamProperty<string> {
  static override token = "dxfpolygonmode"
  token = "dxfpolygonmode"
}
registerPlotParam(PlotParamDxfPolygonMode)

export class PlotParamDxfImperialUnits extends PlotParamProperty<string> {
  static override token = "dxfimperialunits"
  token = "dxfimperialunits"
}
registerPlotParam(PlotParamDxfImperialUnits)

export class PlotParamDxfUsePcbnewFont extends PlotParamProperty<string> {
  static override token = "dxfusepcbnewfont"
  token = "dxfusepcbnewfont"
}
registerPlotParam(PlotParamDxfUsePcbnewFont)

export class PlotParamPsNegative extends PlotParamProperty<string> {
  static override token = "psnegative"
  token = "psnegative"
}
registerPlotParam(PlotParamPsNegative)

