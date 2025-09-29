import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"

export class PcbGeneralLegacyTeardrops extends SxClass {
  static override token = "legacy_teardrops"
  static override parentToken = "general"
  token = "legacy_teardrops"

  private _enabled: boolean

  constructor(enabled: boolean) {
    super()
    this._enabled = enabled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbGeneralLegacyTeardrops {
    const value = toStringValue(primitiveSexprs[0])
    if (value === undefined) {
      throw new Error("legacy_teardrops expects a string value")
    }
    const enabled = /^(yes|true)$/iu.test(value)
    return new PcbGeneralLegacyTeardrops(enabled)
  }

  get enabled(): boolean {
    return this._enabled
  }

  set enabled(value: boolean) {
    this._enabled = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(legacy_teardrops ${this._enabled ? "yes" : "no"})`
  }
}
SxClass.register(PcbGeneralLegacyTeardrops)
