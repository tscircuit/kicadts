import { PcbPlotParams } from "./PcbPlotParams"
import { Stackup } from "./Stackup"
import {
  SetupAuxAxisOrigin,
  SetupGridOrigin,
  SetupModTextSize,
  SetupPadSize,
  SetupPadToPasteClearanceValues,
  SetupPcbTextSize,
  SetupTraceWidth,
} from "./setupMultiValueProperties"
import {
  SetupAllowSoldermaskBridgesInFootprints,
  SetupTenting,
  SetupUviasAllowed,
  SetupVisibleElements,
  SetupZone45Only,
} from "./setupStringProperties"
import {
  SetupEdgeWidth,
  SetupLastTraceWidth,
  SetupModEdgeWidth,
  SetupModTextWidth,
  SetupPadDrill,
  SetupPadToMaskClearance,
  SetupPadToPasteClearance,
  SetupPadToPasteClearanceRatio,
  SetupPcbTextWidth,
  SetupSegmentWidth,
  SetupSolderMaskMinWidth,
  SetupTraceClearance,
  SetupTraceMin,
  SetupUviaDrill,
  SetupUviaMinDrill,
  SetupUviaMinSize,
  SetupUviaSize,
  SetupViaDrill,
  SetupViaMinDrill,
  SetupViaMinSize,
  SetupViaSize,
  SetupZoneClearance,
} from "./setupNumericProperties"

export interface SetupPropertyValues {
  stackup?: Stackup
  pcbPlotParams?: PcbPlotParams
  padToMaskClearance?: SetupPadToMaskClearance
  solderMaskMinWidth?: SetupSolderMaskMinWidth
  padToPasteClearance?: SetupPadToPasteClearance
  padToPasteClearanceRatio?: SetupPadToPasteClearanceRatio
  lastTraceWidth?: SetupLastTraceWidth
  traceClearance?: SetupTraceClearance
  zoneClearance?: SetupZoneClearance
  zone45Only?: SetupZone45Only
  traceMin?: SetupTraceMin
  segmentWidth?: SetupSegmentWidth
  edgeWidth?: SetupEdgeWidth
  viaSize?: SetupViaSize
  viaDrill?: SetupViaDrill
  viaMinSize?: SetupViaMinSize
  viaMinDrill?: SetupViaMinDrill
  uviasAllowed?: SetupUviasAllowed
  uviaSize?: SetupUviaSize
  uviaDrill?: SetupUviaDrill
  uviaMinSize?: SetupUviaMinSize
  uviaMinDrill?: SetupUviaMinDrill
  pcbTextWidth?: SetupPcbTextWidth
  pcbTextSize?: SetupPcbTextSize
  modEdgeWidth?: SetupModEdgeWidth
  modTextSize?: SetupModTextSize
  modTextWidth?: SetupModTextWidth
  padSize?: SetupPadSize
  padDrill?: SetupPadDrill
  allowSoldermaskBridgesInFootprints?: SetupAllowSoldermaskBridgesInFootprints
  tenting?: SetupTenting
  auxAxisOrigin?: SetupAuxAxisOrigin
  gridOrigin?: SetupGridOrigin
  visibleElements?: SetupVisibleElements
  padToPasteClearanceValues?: SetupPadToPasteClearanceValues
  traceWidth?: SetupTraceWidth
}

export type SetupProperty =
  | Stackup
  | PcbPlotParams
  | SetupPadToMaskClearance
  | SetupSolderMaskMinWidth
  | SetupPadToPasteClearance
  | SetupPadToPasteClearanceRatio
  | SetupLastTraceWidth
  | SetupTraceClearance
  | SetupZoneClearance
  | SetupZone45Only
  | SetupTraceMin
  | SetupSegmentWidth
  | SetupEdgeWidth
  | SetupViaSize
  | SetupViaDrill
  | SetupViaMinSize
  | SetupViaMinDrill
  | SetupUviasAllowed
  | SetupUviaSize
  | SetupUviaDrill
  | SetupUviaMinSize
  | SetupUviaMinDrill
  | SetupPcbTextWidth
  | SetupPcbTextSize
  | SetupModEdgeWidth
  | SetupModTextSize
  | SetupModTextWidth
  | SetupPadSize
  | SetupPadDrill
  | SetupAllowSoldermaskBridgesInFootprints
  | SetupTenting
  | SetupAuxAxisOrigin
  | SetupGridOrigin
  | SetupVisibleElements
  | SetupPadToPasteClearanceValues
  | SetupTraceWidth
