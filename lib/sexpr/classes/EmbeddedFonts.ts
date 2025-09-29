import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class EmbeddedFonts extends SxClass {
  static override token = "embedded_fonts"
  override token = "embedded_fonts"

  private _enabled = false

  constructor(enabled = false) {
    super()
    this._enabled = enabled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFonts {
    if (primitiveSexprs.length === 0) {
      return new EmbeddedFonts(false)
    }

    if (primitiveSexprs.length > 1) {
      throw new Error("embedded_fonts accepts at most a single value")
    }

    const [raw] = primitiveSexprs

    if (raw === undefined) {
      return new EmbeddedFonts(false)
    }

    if (typeof raw === "boolean") {
      return new EmbeddedFonts(raw)
    }

    if (typeof raw === "string") {
      const normalized = raw.toLowerCase()
      if (normalized === "yes") {
        return new EmbeddedFonts(true)
      }
      if (normalized === "no") {
        return new EmbeddedFonts(false)
      }
      throw new Error(`embedded_fonts expects "yes" or "no", received "${raw}"`)
    }

    throw new Error(
      `embedded_fonts encountered unsupported value ${JSON.stringify(raw)}`,
    )
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
    return `(embedded_fonts ${this._enabled ? "yes" : "no"})`
  }
}
SxClass.register(EmbeddedFonts)
