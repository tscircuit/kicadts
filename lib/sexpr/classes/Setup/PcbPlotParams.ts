import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

import {
  PlotParamDashedLineDashRatio,
  PlotParamDashedLineGapRatio,
  PlotParamDrillShape,
  PlotParamHpglPenDiameter,
  PlotParamHpglPenNumber,
  PlotParamHpglPenOverlay,
  PlotParamHpglPenSpeed,
  PlotParamLayerSelection,
  PlotParamLineWidth,
  PlotParamMode,
  PlotParamOutputFormat,
  PlotParamPlotOnAllLayersSelection,
  PlotParamScaleSelection,
  PlotParamSvgPrecision,
} from "./PcbPlotParamsNumericProperties"
import { PlotParamProperty } from "./PcbPlotParamsBase"
import {
  PlotParamCreateGerberJobFile,
  PlotParamDisableApertMacros,
  PlotParamDxfImperialUnits,
  PlotParamDxfPolygonMode,
  PlotParamDxfUsePcbnewFont,
  PlotParamExcludeEdgeLayer,
  PlotParamPdfBackFpPropertyPopups,
  PlotParamPdfFrontFpPropertyPopups,
  PlotParamPdfMetadata,
  PlotParamPdfSingleDocument,
  PlotParamPlotFrameRef,
  PlotParamPsNegative,
  PlotParamUseAuxOrigin,
  PlotParamUseGerberAdvancedAttributes,
  PlotParamUseGerberAttributes,
  PlotParamUseGerberExtensions,
  PlotParamViaOnMask,
} from "./PcbPlotParamsStringPropertiesA"
import {
  PlotParamCrossoutDnpOnFab,
  PlotParamHideDnpOnFab,
  PlotParamMirror,
  PlotParamOutputDirectory,
  PlotParamPadOnSilk,
  PlotParamPlotBlackAndWhite,
  PlotParamPlotInvisible,
  PlotParamPlotInvisibleText,
  PlotParamPlotOnAllLayers,
  PlotParamPlotOtherText,
  PlotParamPlotPadNumbers,
  PlotParamPlotReference,
  PlotParamPlotValue,
  PlotParamPsA4Output,
  PlotParamSketchDnpOnFab,
  PlotParamSketchPadsOnFab,
  PlotParamSubtractMaskFromSilk,
} from "./PcbPlotParamsStringPropertiesB"

const TOKEN_TO_KEY = {
  layerselection: "layerselection",
  plot_on_all_layers_selection: "plot_on_all_layers_selection",
  disableapertmacros: "disableapertmacros",
  usegerberextensions: "usegerberextensions",
  usegerberattributes: "usegerberattributes",
  usegerberadvancedattributes: "usegerberadvancedattributes",
  creategerberjobfile: "creategerberjobfile",
  excludeedgelayer: "excludeedgelayer",
  dashed_line_dash_ratio: "dashed_line_dash_ratio",
  dashed_line_gap_ratio: "dashed_line_gap_ratio",
  svgprecision: "svgprecision",
  linewidth: "linewidth",
  plotframeref: "plotframeref",
  plotreference: "plotreference",
  plotvalue: "plotvalue",
  plotothertext: "plotothertext",
  plotinvisibletext: "plotinvisibletext",
  padsonsilk: "padsonsilk",
  sketchpadsonfab: "sketchpadsonfab",
  plotpadnumbers: "plotpadnumbers",
  hidednponfab: "hidednponfab",
  sketchdnponfab: "sketchdnponfab",
  crossoutdnponfab: "crossoutdnponfab",
  subtractmaskfromsilk: "subtractmaskfromsilk",
  plot_black_and_white: "plot_black_and_white",
  plot_on_all_layers: "plot_on_all_layers",
  plotinvisible: "plotinvisible",
  mode: "mode",
  useauxorigin: "useauxorigin",
  viasonmask: "viasonmask",
  hpglpennumber: "hpglpennumber",
  hpglpenspeed: "hpglpenspeed",
  hpglpendiameter: "hpglpendiameter",
  hpglpenoverlay: "hpglpenoverlay",
  pdf_front_fp_property_popups: "pdf_front_fp_property_popups",
  pdf_back_fp_property_popups: "pdf_back_fp_property_popups",
  pdf_metadata: "pdf_metadata",
  pdf_single_document: "pdf_single_document",
  dxfpolygonmode: "dxfpolygonmode",
  dxfimperialunits: "dxfimperialunits",
  dxfusepcbnewfont: "dxfusepcbnewfont",
  psnegative: "psnegative",
  psa4output: "psa4output",
  mirror: "mirror",
  outputformat: "outputformat",
  drillshape: "drillshape",
  scaleselection: "scaleselection",
  outputdirectory: "outputdirectory",
} as const

type PlotParamKey = (typeof TOKEN_TO_KEY)[keyof typeof TOKEN_TO_KEY]

type PcbPlotParamValues = Partial<Record<PlotParamKey, PlotParamProperty<any>>>

const PCB_PLOT_PARAM_CHILD_ORDER: PlotParamKey[] = [
  "layerselection",
  "plot_on_all_layers_selection",
  "disableapertmacros",
  "usegerberextensions",
  "usegerberattributes",
  "usegerberadvancedattributes",
  "creategerberjobfile",
  "excludeedgelayer",
  "dashed_line_dash_ratio",
  "dashed_line_gap_ratio",
  "svgprecision",
  "linewidth",
  "plotframeref",
  "plotreference",
  "plotvalue",
  "plotothertext",
  "mode",
  "useauxorigin",
  "viasonmask",
  "hpglpennumber",
  "hpglpenspeed",
  "hpglpendiameter",
  "hpglpenoverlay",
  "pdf_front_fp_property_popups",
  "pdf_back_fp_property_popups",
  "pdf_metadata",
  "pdf_single_document",
  "dxfpolygonmode",
  "dxfimperialunits",
  "dxfusepcbnewfont",
  "psnegative",
  "psa4output",
  "plot_black_and_white",
  "plot_on_all_layers",
  "plotinvisible",
  "plotinvisibletext",
  "padsonsilk",
  "sketchpadsonfab",
  "plotpadnumbers",
  "hidednponfab",
  "sketchdnponfab",
  "crossoutdnponfab",
  "subtractmaskfromsilk",
  "outputformat",
  "mirror",
  "drillshape",
  "scaleselection",
  "outputdirectory",
]

export class PcbPlotParams extends SxClass {
  static override token = "pcbplotparams"
  static override parentToken = "setup"
  token = "pcbplotparams"

  private _properties: PcbPlotParamValues = {}

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbPlotParams {
    const params = new PcbPlotParams()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    for (const [token, instance] of Object.entries(propertyMap)) {
      const key = TOKEN_TO_KEY[token as keyof typeof TOKEN_TO_KEY]
      if (!key) {
        throw new Error(`Unsupported pcbplotparams token: ${token}`)
      }
      params._properties[key] = instance as PlotParamProperty<any>
    }

    return params
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    for (const key of PCB_PLOT_PARAM_CHILD_ORDER) {
      const child = this._properties[key]
      if (child) {
        children.push(child)
      }
    }
    return children
  }

  private clearProperty(key: PlotParamKey) {
    delete this._properties[key]
  }

  private setStringProperty<
    K extends PlotParamKey,
    T extends { new (value: string): PlotParamProperty<any> },
  >(
    key: K,
    value: string | undefined,
    ClassRef: T,
  ) {
    if (value === undefined) {
      this.clearProperty(key)
      return
    }
    this._properties[key] = new ClassRef(value)
  }

  private setNumberProperty<
    K extends PlotParamKey,
    T extends { new (value: number): PlotParamProperty<any> },
  >(
    key: K,
    value: number | undefined,
    ClassRef: T,
  ) {
    if (value === undefined) {
      this.clearProperty(key)
      return
    }
    this._properties[key] = new ClassRef(value)
  }

  private setStringOrNumberProperty<
    K extends PlotParamKey,
    T extends { new (value: string | number): PlotParamProperty<any> },
  >(key: K, value: string | number | undefined, ClassRef: T) {
    if (value === undefined) {
      this.clearProperty(key)
      return
    }
    this._properties[key] = new ClassRef(value)
  }

  get layerselection(): string | number | undefined {
    return this._properties.layerselection?.value
  }

  set layerselection(value: string | number | undefined) {
    this.setStringOrNumberProperty(
      "layerselection",
      value,
      PlotParamLayerSelection,
    )
  }

  get plot_on_all_layers_selection(): string | number | undefined {
    return this._properties.plot_on_all_layers_selection?.value
  }

  set plot_on_all_layers_selection(value: string | number | undefined) {
    this.setStringOrNumberProperty(
      "plot_on_all_layers_selection",
      value,
      PlotParamPlotOnAllLayersSelection,
    )
  }

  get disableapertmacros(): string | undefined {
    return this._properties.disableapertmacros?.value
  }

  set disableapertmacros(value: string | undefined) {
    this.setStringProperty(
      "disableapertmacros",
      value,
      PlotParamDisableApertMacros,
    )
  }

  get usegerberextensions(): string | undefined {
    return this._properties.usegerberextensions?.value
  }

  set usegerberextensions(value: string | undefined) {
    this.setStringProperty(
      "usegerberextensions",
      value,
      PlotParamUseGerberExtensions,
    )
  }

  get usegerberattributes(): string | undefined {
    return this._properties.usegerberattributes?.value
  }

  set usegerberattributes(value: string | undefined) {
    this.setStringProperty(
      "usegerberattributes",
      value,
      PlotParamUseGerberAttributes,
    )
  }

  get usegerberadvancedattributes(): string | undefined {
    return this._properties.usegerberadvancedattributes?.value
  }

  set usegerberadvancedattributes(value: string | undefined) {
    this.setStringProperty(
      "usegerberadvancedattributes",
      value,
      PlotParamUseGerberAdvancedAttributes,
    )
  }

  get creategerberjobfile(): string | undefined {
    return this._properties.creategerberjobfile?.value
  }

  set creategerberjobfile(value: string | undefined) {
    this.setStringProperty(
      "creategerberjobfile",
      value,
      PlotParamCreateGerberJobFile,
    )
  }

  get excludeedgelayer(): string | undefined {
    return this._properties.excludeedgelayer?.value
  }

  set excludeedgelayer(value: string | undefined) {
    this.setStringProperty(
      "excludeedgelayer",
      value,
      PlotParamExcludeEdgeLayer,
    )
  }

  get dashed_line_dash_ratio(): number | undefined {
    return this._properties.dashed_line_dash_ratio?.value
  }

  set dashed_line_dash_ratio(value: number | undefined) {
    this.setNumberProperty(
      "dashed_line_dash_ratio",
      value,
      PlotParamDashedLineDashRatio,
    )
  }

  get dashed_line_gap_ratio(): number | undefined {
    return this._properties.dashed_line_gap_ratio?.value
  }

  set dashed_line_gap_ratio(value: number | undefined) {
    this.setNumberProperty(
      "dashed_line_gap_ratio",
      value,
      PlotParamDashedLineGapRatio,
    )
  }

  get svgprecision(): number | undefined {
    return this._properties.svgprecision?.value
  }

  set svgprecision(value: number | undefined) {
    this.setNumberProperty("svgprecision", value, PlotParamSvgPrecision)
  }

  get linewidth(): number | undefined {
    return this._properties.linewidth?.value
  }

  set linewidth(value: number | undefined) {
    this.setNumberProperty("linewidth", value, PlotParamLineWidth)
  }

  get plotframeref(): string | undefined {
    return this._properties.plotframeref?.value
  }

  set plotframeref(value: string | undefined) {
    this.setStringProperty("plotframeref", value, PlotParamPlotFrameRef)
  }

  get plotreference(): string | undefined {
    return this._properties.plotreference?.value
  }

  set plotreference(value: string | undefined) {
    this.setStringProperty("plotreference", value, PlotParamPlotReference)
  }

  get plotvalue(): string | undefined {
    return this._properties.plotvalue?.value
  }

  set plotvalue(value: string | undefined) {
    this.setStringProperty("plotvalue", value, PlotParamPlotValue)
  }

  get plotothertext(): string | undefined {
    return this._properties.plotothertext?.value
  }

  set plotothertext(value: string | undefined) {
    this.setStringProperty("plotothertext", value, PlotParamPlotOtherText)
  }

  get plotinvisibletext(): string | undefined {
    return this._properties.plotinvisibletext?.value
  }

  set plotinvisibletext(value: string | undefined) {
    this.setStringProperty(
      "plotinvisibletext",
      value,
      PlotParamPlotInvisibleText,
    )
  }

  get padsonsilk(): string | undefined {
    return this._properties.padsonsilk?.value
  }

  set padsonsilk(value: string | undefined) {
    this.setStringProperty("padsonsilk", value, PlotParamPadOnSilk)
  }

  get plotpadnumbers(): string | undefined {
    return this._properties.plotpadnumbers?.value
  }

  set plotpadnumbers(value: string | undefined) {
    this.setStringProperty("plotpadnumbers", value, PlotParamPlotPadNumbers)
  }

  get sketchpadsonfab(): string | undefined {
    return this._properties.sketchpadsonfab?.value
  }

  set sketchpadsonfab(value: string | undefined) {
    this.setStringProperty(
      "sketchpadsonfab",
      value,
      PlotParamSketchPadsOnFab,
    )
  }

  get hidednponfab(): string | undefined {
    return this._properties.hidednponfab?.value
  }

  set hidednponfab(value: string | undefined) {
    this.setStringProperty("hidednponfab", value, PlotParamHideDnpOnFab)
  }

  get sketchdnponfab(): string | undefined {
    return this._properties.sketchdnponfab?.value
  }

  set sketchdnponfab(value: string | undefined) {
    this.setStringProperty("sketchdnponfab", value, PlotParamSketchDnpOnFab)
  }

  get crossoutdnponfab(): string | undefined {
    return this._properties.crossoutdnponfab?.value
  }

  set crossoutdnponfab(value: string | undefined) {
    this.setStringProperty(
      "crossoutdnponfab",
      value,
      PlotParamCrossoutDnpOnFab,
    )
  }

  get subtractmaskfromsilk(): string | undefined {
    return this._properties.subtractmaskfromsilk?.value
  }

  set subtractmaskfromsilk(value: string | undefined) {
    this.setStringProperty(
      "subtractmaskfromsilk",
      value,
      PlotParamSubtractMaskFromSilk,
    )
  }

  get plot_black_and_white(): string | undefined {
    return this._properties.plot_black_and_white?.value
  }

  set plot_black_and_white(value: string | undefined) {
    this.setStringProperty(
      "plot_black_and_white",
      value,
      PlotParamPlotBlackAndWhite,
    )
  }

  get plot_on_all_layers(): string | undefined {
    return this._properties.plot_on_all_layers?.value
  }

  set plot_on_all_layers(value: string | undefined) {
    this.setStringProperty(
      "plot_on_all_layers",
      value,
      PlotParamPlotOnAllLayers,
    )
  }

  get plotinvisible(): string | undefined {
    return this._properties.plotinvisible?.value
  }

  set plotinvisible(value: string | undefined) {
    this.setStringProperty("plotinvisible", value, PlotParamPlotInvisible)
  }

  get mode(): number | undefined {
    return this._properties.mode?.value
  }

  set mode(value: number | undefined) {
    this.setNumberProperty("mode", value, PlotParamMode)
  }

  get useauxorigin(): string | undefined {
    return this._properties.useauxorigin?.value
  }

  set useauxorigin(value: string | undefined) {
    this.setStringProperty("useauxorigin", value, PlotParamUseAuxOrigin)
  }

  get viasonmask(): string | undefined {
    return this._properties.viasonmask?.value
  }

  set viasonmask(value: string | undefined) {
    this.setStringProperty("viasonmask", value, PlotParamViaOnMask)
  }

  get hpglpennumber(): number | undefined {
    return this._properties.hpglpennumber?.value
  }

  set hpglpennumber(value: number | undefined) {
    this.setNumberProperty("hpglpennumber", value, PlotParamHpglPenNumber)
  }

  get hpglpenspeed(): number | undefined {
    return this._properties.hpglpenspeed?.value
  }

  set hpglpenspeed(value: number | undefined) {
    this.setNumberProperty("hpglpenspeed", value, PlotParamHpglPenSpeed)
  }

  get hpglpendiameter(): number | undefined {
    return this._properties.hpglpendiameter?.value
  }

  set hpglpendiameter(value: number | undefined) {
    this.setNumberProperty(
      "hpglpendiameter",
      value,
      PlotParamHpglPenDiameter,
    )
  }

  get hpglpenoverlay(): number | undefined {
    return this._properties.hpglpenoverlay?.value
  }

  set hpglpenoverlay(value: number | undefined) {
    this.setNumberProperty(
      "hpglpenoverlay",
      value,
      PlotParamHpglPenOverlay,
    )
  }

  get pdf_front_fp_property_popups(): string | undefined {
    return this._properties.pdf_front_fp_property_popups?.value
  }

  set pdf_front_fp_property_popups(value: string | undefined) {
    this.setStringProperty(
      "pdf_front_fp_property_popups",
      value,
      PlotParamPdfFrontFpPropertyPopups,
    )
  }

  get pdf_back_fp_property_popups(): string | undefined {
    return this._properties.pdf_back_fp_property_popups?.value
  }

  set pdf_back_fp_property_popups(value: string | undefined) {
    this.setStringProperty(
      "pdf_back_fp_property_popups",
      value,
      PlotParamPdfBackFpPropertyPopups,
    )
  }

  get pdf_metadata(): string | undefined {
    return this._properties.pdf_metadata?.value
  }

  set pdf_metadata(value: string | undefined) {
    this.setStringProperty("pdf_metadata", value, PlotParamPdfMetadata)
  }

  get pdf_single_document(): string | undefined {
    return this._properties.pdf_single_document?.value
  }

  set pdf_single_document(value: string | undefined) {
    this.setStringProperty(
      "pdf_single_document",
      value,
      PlotParamPdfSingleDocument,
    )
  }

  get dxfpolygonmode(): string | undefined {
    return this._properties.dxfpolygonmode?.value
  }

  set dxfpolygonmode(value: string | undefined) {
    this.setStringProperty("dxfpolygonmode", value, PlotParamDxfPolygonMode)
  }

  get dxfimperialunits(): string | undefined {
    return this._properties.dxfimperialunits?.value
  }

  set dxfimperialunits(value: string | undefined) {
    this.setStringProperty(
      "dxfimperialunits",
      value,
      PlotParamDxfImperialUnits,
    )
  }

  get dxfusepcbnewfont(): string | undefined {
    return this._properties.dxfusepcbnewfont?.value
  }

  set dxfusepcbnewfont(value: string | undefined) {
    this.setStringProperty(
      "dxfusepcbnewfont",
      value,
      PlotParamDxfUsePcbnewFont,
    )
  }

  get psnegative(): string | undefined {
    return this._properties.psnegative?.value
  }

  set psnegative(value: string | undefined) {
    this.setStringProperty("psnegative", value, PlotParamPsNegative)
  }

  get psa4output(): string | undefined {
    return this._properties.psa4output?.value
  }

  set psa4output(value: string | undefined) {
    this.setStringProperty("psa4output", value, PlotParamPsA4Output)
  }

  get mirror(): string | undefined {
    return this._properties.mirror?.value
  }

  set mirror(value: string | undefined) {
    this.setStringProperty("mirror", value, PlotParamMirror)
  }

  get outputformat(): number | undefined {
    return this._properties.outputformat?.value
  }

  set outputformat(value: number | undefined) {
    this.setNumberProperty("outputformat", value, PlotParamOutputFormat)
  }

  get drillshape(): number | undefined {
    return this._properties.drillshape?.value
  }

  set drillshape(value: number | undefined) {
    this.setNumberProperty("drillshape", value, PlotParamDrillShape)
  }

  get scaleselection(): number | undefined {
    return this._properties.scaleselection?.value
  }

  set scaleselection(value: number | undefined) {
    this.setNumberProperty("scaleselection", value, PlotParamScaleSelection)
  }

  get outputdirectory(): string | undefined {
    return this._properties.outputdirectory?.value
  }

  set outputdirectory(value: string | undefined) {
    this.setStringProperty(
      "outputdirectory",
      value,
      PlotParamOutputDirectory,
    )
  }
}
SxClass.register(PcbPlotParams)
