import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { ZonePlacementComponentClass } from "./ZonePlacementComponentClass"
import { ZonePlacementEnabled } from "./ZonePlacementEnabled"
import { ZonePlacementGroup } from "./ZonePlacementGroup"
import { ZonePlacementSheetname } from "./ZonePlacementSheetname"

export class ZonePlacement extends SxClass {
  static override token = "placement"
  static override parentToken = "zone"
  override token = "placement"

  private _sxEnabled?: ZonePlacementEnabled
  private _sxSource?:
    | ZonePlacementSheetname
    | ZonePlacementComponentClass
    | ZonePlacementGroup

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZonePlacement {
    const placement = new ZonePlacement()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || typeof primitive[0] !== "string") {
        throw new Error(
          `zone placement encountered invalid child ${JSON.stringify(primitive)}`,
        )
      }

      const child = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })
      if (child instanceof ZonePlacementEnabled) {
        placement._sxEnabled = child
        continue
      }
      if (
        child instanceof ZonePlacementSheetname ||
        child instanceof ZonePlacementComponentClass ||
        child instanceof ZonePlacementGroup
      ) {
        // KiCad stores one source type/value; the last source in input wins.
        placement._sxSource = child
        continue
      }
      throw new Error(
        `zone placement encountered unsupported child "${primitive[0]}"`,
      )
    }
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
    return this._sxSource instanceof ZonePlacementSheetname
      ? this._sxSource.value
      : undefined
  }

  set sheetname(value: ZonePlacementSheetname | string | undefined) {
    if (value === undefined) {
      if (this._sxSource instanceof ZonePlacementSheetname) {
        this._sxSource = undefined
      }
      return
    }
    this._sxSource =
      value instanceof ZonePlacementSheetname
        ? value
        : new ZonePlacementSheetname(value)
  }

  get componentClass(): string | undefined {
    return this._sxSource instanceof ZonePlacementComponentClass
      ? this._sxSource.value
      : undefined
  }

  set componentClass(value: ZonePlacementComponentClass | string | undefined) {
    if (value === undefined) {
      if (this._sxSource instanceof ZonePlacementComponentClass) {
        this._sxSource = undefined
      }
      return
    }
    this._sxSource =
      value instanceof ZonePlacementComponentClass
        ? value
        : new ZonePlacementComponentClass(value)
  }

  get group(): string | undefined {
    return this._sxSource instanceof ZonePlacementGroup
      ? this._sxSource.value
      : undefined
  }

  set group(value: ZonePlacementGroup | string | undefined) {
    if (value === undefined) {
      if (this._sxSource instanceof ZonePlacementGroup) {
        this._sxSource = undefined
      }
      return
    }
    this._sxSource =
      value instanceof ZonePlacementGroup
        ? value
        : new ZonePlacementGroup(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxEnabled) children.push(this._sxEnabled)
    if (this._sxSource) children.push(this._sxSource)
    return children
  }
}
SxClass.register(ZonePlacement)
