import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Uuid } from "./Uuid"
import { GeneratedType } from "./GeneratedType"
import { GeneratedName } from "./GeneratedName"
import { GeneratedBaseLine } from "./GeneratedBaseLine"
import { GeneratedBaseLineCoupled } from "./GeneratedBaseLineCoupled"
import { GeneratedMembers } from "./GeneratedMembers"
import { GeneratedEnd } from "./GeneratedEnd"
import { GeneratedOrigin } from "./GeneratedOrigin"
import { GeneratedSimpleField } from "./GeneratedSimpleField"

const SUPPORTED_SINGLE_TOKENS = new Set([
  "uuid",
  "type",
  "name",
  "layer",
  "base_line",
  "base_line_coupled",
  "corner_radius_percent",
  "end",
  "initial_side",
  "last_diff_pair_gap",
  "last_netname",
  "last_status",
  "last_track_width",
  "last_tuning",
  "max_amplitude",
  "min_amplitude",
  "min_spacing",
  "origin",
  "override_custom_rules",
  "rounded",
  "single_sided",
  "target_length",
  "target_length_max",
  "target_length_min",
  "target_skew",
  "target_skew_max",
  "target_skew_min",
  "tuning_mode",
  "members",
])

export class Generated extends SxClass {
  static override token = "generated"
  static override parentToken = "kicad_pcb"
  override token = "generated"

  private _sxUuid?: Uuid
  private _sxType?: GeneratedType
  private _sxName?: GeneratedName
  private _sxLayer?: Layer
  private _sxBaseLine?: GeneratedBaseLine
  private _sxBaseLineCoupled?: GeneratedBaseLineCoupled
  private _sxMembers?: GeneratedMembers
  private _sxEnd?: GeneratedEnd
  private _sxOrigin?: GeneratedOrigin
  private _otherChildren: GeneratedSimpleField[] = []

  constructor() {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Generated {
    const generated = new Generated()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        throw new Error(
          `generated encountered unsupported child token "${token}"`,
        )
      }
    }

    generated._sxUuid = propertyMap.uuid as Uuid | undefined
    generated._sxType = propertyMap.type as GeneratedType | undefined
    generated._sxName = propertyMap.name as GeneratedName | undefined
    generated._sxLayer = propertyMap.layer as Layer | undefined
    generated._sxBaseLine = propertyMap.base_line as
      | GeneratedBaseLine
      | undefined
    generated._sxBaseLineCoupled = propertyMap.base_line_coupled as
      | GeneratedBaseLineCoupled
      | undefined
    generated._sxMembers = propertyMap.members as GeneratedMembers | undefined
    generated._sxEnd = propertyMap.end as GeneratedEnd | undefined
    generated._sxOrigin = propertyMap.origin as GeneratedOrigin | undefined

    // Collect all simple fields
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      const first = entries[0]
      if (first instanceof GeneratedSimpleField) {
        generated._otherChildren.push(...(entries as GeneratedSimpleField[]))
      }
    }

    return generated
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxType) children.push(this._sxType)
    if (this._sxName) children.push(this._sxName)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxBaseLine) children.push(this._sxBaseLine)
    if (this._sxBaseLineCoupled) children.push(this._sxBaseLineCoupled)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxOrigin) children.push(this._sxOrigin)
    children.push(...this._otherChildren)
    if (this._sxMembers) children.push(this._sxMembers)
    return children
  }

  override getString(): string {
    const lines = ["(generated"]
    for (const child of this.getChildren()) {
      lines.push(child.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Generated)
