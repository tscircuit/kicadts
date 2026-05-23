import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { parseYesNo } from "../utils/parseYesNo"
import { ZoneConnectPadsClearance } from "./ZoneConnectPadsClearance"

export type ZoneConnectPadsMode = "yes" | "no" | "thru_hole_only"

export class ZoneConnectPads extends SxClass {
  static override token = "connect_pads"
  static override parentToken = "zone"
  override token = "connect_pads"

  private _mode?: ZoneConnectPadsMode
  private _sxClearance?: ZoneConnectPadsClearance

  constructor(
    params: {
      enabled?: boolean
      mode?: ZoneConnectPadsMode
      clearance?: number
    } = {},
  ) {
    super()
    if (params.mode !== undefined) this.mode = params.mode
    if (params.enabled !== undefined) this.enabled = params.enabled
    if (params.clearance !== undefined) this.clearance = params.clearance
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ZoneConnectPads {
    const connectPads = new ZoneConnectPads()
    for (const primitive of primitiveSexprs) {
      const enabled = parseYesNo(primitive)
      if (enabled !== undefined) {
        connectPads.enabled = enabled
        continue
      }
      if (primitive === "thru_hole_only") {
        connectPads.mode = primitive
        continue
      }
      if (!Array.isArray(primitive) || typeof primitive[0] !== "string") {
        throw new Error(
          `zone connect_pads encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })
      if (parsed instanceof ZoneConnectPadsClearance) {
        if (connectPads._sxClearance) {
          throw new Error("zone connect_pads encountered duplicate clearance")
        }
        connectPads._sxClearance = parsed
        continue
      }

      throw new Error(
        `zone connect_pads encountered unsupported child ${JSON.stringify(primitive)}`,
      )
    }
    return connectPads
  }

  get enabled(): boolean | undefined {
    if (this._mode === undefined) return undefined
    return this._mode !== "no"
  }

  set enabled(value: boolean | undefined) {
    this._mode = value === undefined ? undefined : value ? "yes" : "no"
  }

  get mode(): ZoneConnectPadsMode | undefined {
    return this._mode
  }

  set mode(value: ZoneConnectPadsMode | undefined) {
    this._mode = value
  }

  get clearance(): number | undefined {
    return this._sxClearance?.value
  }

  set clearance(value: ZoneConnectPadsClearance | number | undefined) {
    this._sxClearance =
      value === undefined
        ? undefined
        : value instanceof ZoneConnectPadsClearance
          ? value
          : new ZoneConnectPadsClearance(value)
  }

  override getChildren(): SxClass[] {
    return this._sxClearance ? [this._sxClearance] : []
  }

  override getString(): string {
    if (this._mode === undefined) return super.getString()
    const children = this.getChildren()
    if (children.length === 0) {
      return `(connect_pads ${this._mode})`
    }
    const lines = [`(connect_pads ${this._mode}`]
    for (const child of children) lines.push(child.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(ZoneConnectPads)
