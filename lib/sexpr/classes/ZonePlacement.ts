import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { ZonePlacementEnabled } from "./ZonePlacementEnabled"
import { ZonePlacementSheetname } from "./ZonePlacementSheetname"

export class ZonePlacement extends SxClass {
  static override token = "placement"
  static override parentToken = "zone"
  override token = "placement"

  private _sxEnabled?: ZonePlacementEnabled
  private _sxSheetname?: ZonePlacementSheetname

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZonePlacement {
    const placement = new ZonePlacement()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "enabled" && token !== "sheetname") {
        throw new Error(
          `zone placement encountered unsupported child "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `zone placement does not support repeated child "${token}"`,
        )
      }
    }
    placement._sxEnabled = propertyMap.enabled as
      | ZonePlacementEnabled
      | undefined
    placement._sxSheetname = propertyMap.sheetname as
      | ZonePlacementSheetname
      | undefined
    return placement
  }

  get enabled(): boolean | undefined {
    return this._sxEnabled?.value
  }

  set enabled(value: ZonePlacementEnabled | boolean | undefined) {
    this._sxEnabled =
      value === undefined
        ? undefined
        : value instanceof ZonePlacementEnabled
          ? value
          : new ZonePlacementEnabled(value)
  }

  get sheetname(): string | undefined {
    return this._sxSheetname?.value
  }

  set sheetname(value: ZonePlacementSheetname | string | undefined) {
    this._sxSheetname =
      value === undefined
        ? undefined
        : value instanceof ZonePlacementSheetname
          ? value
          : new ZonePlacementSheetname(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxEnabled) children.push(this._sxEnabled)
    if (this._sxSheetname) children.push(this._sxSheetname)
    return children
  }
}
SxClass.register(ZonePlacement)
