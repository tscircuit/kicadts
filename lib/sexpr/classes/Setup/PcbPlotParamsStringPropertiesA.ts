import { SxClass } from "../../base-classes/SxClass"
import { PlotParamProperty } from "./PcbPlotParamsBase"

export class PlotParamDisableApertMacros extends PlotParamProperty<string> {
  static override token = "disableapertmacros"
  token = "disableapertmacros"
}
SxClass.register(PlotParamDisableApertMacros)

export class PlotParamUseGerberExtensions extends PlotParamProperty<string> {
  static override token = "usegerberextensions"
  token = "usegerberextensions"
}
SxClass.register(PlotParamUseGerberExtensions)

export class PlotParamUseGerberAttributes extends PlotParamProperty<string> {
  static override token = "usegerberattributes"
  token = "usegerberattributes"
}
SxClass.register(PlotParamUseGerberAttributes)

export class PlotParamUseGerberAdvancedAttributes extends PlotParamProperty<string> {
  static override token = "usegerberadvancedattributes"
  token = "usegerberadvancedattributes"
}
SxClass.register(PlotParamUseGerberAdvancedAttributes)

export class PlotParamCreateGerberJobFile extends PlotParamProperty<string> {
  static override token = "creategerberjobfile"
  token = "creategerberjobfile"
}
SxClass.register(PlotParamCreateGerberJobFile)

export class PlotParamExcludeEdgeLayer extends PlotParamProperty<string> {
  static override token = "excludeedgelayer"
  token = "excludeedgelayer"
}
SxClass.register(PlotParamExcludeEdgeLayer)

export class PlotParamPlotFrameRef extends PlotParamProperty<string> {
  static override token = "plotframeref"
  token = "plotframeref"
}
SxClass.register(PlotParamPlotFrameRef)

export class PlotParamViaOnMask extends PlotParamProperty<string> {
  static override token = "viasonmask"
  token = "viasonmask"
}
SxClass.register(PlotParamViaOnMask)

export class PlotParamUseAuxOrigin extends PlotParamProperty<string> {
  static override token = "useauxorigin"
  token = "useauxorigin"
}
SxClass.register(PlotParamUseAuxOrigin)

export class PlotParamPdfFrontFpPropertyPopups extends PlotParamProperty<string> {
  static override token = "pdf_front_fp_property_popups"
  token = "pdf_front_fp_property_popups"
}
SxClass.register(PlotParamPdfFrontFpPropertyPopups)

export class PlotParamPdfBackFpPropertyPopups extends PlotParamProperty<string> {
  static override token = "pdf_back_fp_property_popups"
  token = "pdf_back_fp_property_popups"
}
SxClass.register(PlotParamPdfBackFpPropertyPopups)

export class PlotParamPdfMetadata extends PlotParamProperty<string> {
  static override token = "pdf_metadata"
  token = "pdf_metadata"
}
SxClass.register(PlotParamPdfMetadata)

export class PlotParamPdfSingleDocument extends PlotParamProperty<string> {
  static override token = "pdf_single_document"
  token = "pdf_single_document"
}
SxClass.register(PlotParamPdfSingleDocument)

export class PlotParamDxfPolygonMode extends PlotParamProperty<string> {
  static override token = "dxfpolygonmode"
  token = "dxfpolygonmode"
}
SxClass.register(PlotParamDxfPolygonMode)

export class PlotParamDxfImperialUnits extends PlotParamProperty<string> {
  static override token = "dxfimperialunits"
  token = "dxfimperialunits"
}
SxClass.register(PlotParamDxfImperialUnits)

export class PlotParamDxfUsePcbnewFont extends PlotParamProperty<string> {
  static override token = "dxfusepcbnewfont"
  token = "dxfusepcbnewfont"
}
SxClass.register(PlotParamDxfUsePcbnewFont)

export class PlotParamPsNegative extends PlotParamProperty<string> {
  static override token = "psnegative"
  token = "psnegative"
}
SxClass.register(PlotParamPsNegative)
