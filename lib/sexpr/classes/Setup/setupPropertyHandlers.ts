import type { SetupPropertyValues } from "./SetupPropertyTypes"
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

type Constructor<T> = new (...args: any[]) => T

export const setupPropertyDescriptors = [
  { Class: Stackup, key: "stackup" },
  { Class: PcbPlotParams, key: "pcbPlotParams" },
  { Class: SetupPadToMaskClearance, key: "padToMaskClearance" },
  { Class: SetupSolderMaskMinWidth, key: "solderMaskMinWidth" },
  { Class: SetupPadToPasteClearance, key: "padToPasteClearance" },
  { Class: SetupPadToPasteClearanceRatio, key: "padToPasteClearanceRatio" },
  { Class: SetupLastTraceWidth, key: "lastTraceWidth" },
  { Class: SetupTraceClearance, key: "traceClearance" },
  { Class: SetupZoneClearance, key: "zoneClearance" },
  { Class: SetupZone45Only, key: "zone45Only" },
  { Class: SetupTraceMin, key: "traceMin" },
  { Class: SetupSegmentWidth, key: "segmentWidth" },
  { Class: SetupEdgeWidth, key: "edgeWidth" },
  { Class: SetupViaSize, key: "viaSize" },
  { Class: SetupViaDrill, key: "viaDrill" },
  { Class: SetupViaMinSize, key: "viaMinSize" },
  { Class: SetupViaMinDrill, key: "viaMinDrill" },
  { Class: SetupUviasAllowed, key: "uviasAllowed" },
  { Class: SetupUviaSize, key: "uviaSize" },
  { Class: SetupUviaDrill, key: "uviaDrill" },
  { Class: SetupUviaMinSize, key: "uviaMinSize" },
  { Class: SetupUviaMinDrill, key: "uviaMinDrill" },
  { Class: SetupPcbTextWidth, key: "pcbTextWidth" },
  { Class: SetupPcbTextSize, key: "pcbTextSize" },
  { Class: SetupModEdgeWidth, key: "modEdgeWidth" },
  { Class: SetupModTextSize, key: "modTextSize" },
  { Class: SetupModTextWidth, key: "modTextWidth" },
  { Class: SetupPadSize, key: "padSize" },
  { Class: SetupPadDrill, key: "padDrill" },
  {
    Class: SetupAllowSoldermaskBridgesInFootprints,
    key: "allowSoldermaskBridgesInFootprints",
  },
  { Class: SetupTenting, key: "tenting" },
  { Class: SetupAuxAxisOrigin, key: "auxAxisOrigin" },
  { Class: SetupGridOrigin, key: "gridOrigin" },
  { Class: SetupVisibleElements, key: "visibleElements" },
  { Class: SetupPadToPasteClearanceValues, key: "padToPasteClearanceValues" },
  { Class: SetupTraceWidth, key: "traceWidth" },
] as const satisfies ReadonlyArray<{
  Class: Constructor<SetupPropertyValues[keyof SetupPropertyValues]>
  key: keyof SetupPropertyValues
}>
