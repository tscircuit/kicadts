import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { GrLineEnd } from "./GrLineEnd"
import { GrLineStart } from "./GrLineStart"
import { Width } from "./Width"

const SUPPORTED_TOKENS = new Set(["start", "end", "width"])

export class PadPrimitiveGrLine extends SxClass {
  static override token = "gr_line"
  static override parentToken = "primitives"
  override token = "gr_line"

  private _sxStart?: GrLineStart
  private _sxEnd?: GrLineEnd
  private _sxWidth?: Width

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrLine {
    const line = new PadPrimitiveGrLine()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_line encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_line encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `pad primitive gr_line does not support repeated "${token}" tokens`,
        )
      }
    }

    line._sxStart = propertyMap.start as GrLineStart | undefined
    line._sxEnd = propertyMap.end as GrLineEnd | undefined
    line._sxWidth = propertyMap.width as Width | undefined

    if (!line._sxStart) {
      throw new Error("pad primitive gr_line requires a start child token")
    }
    if (!line._sxEnd) {
      throw new Error("pad primitive gr_line requires an end child token")
    }

    return line
  }

  get start(): GrLineStart | undefined {
    return this._sxStart
  }

  set start(value: GrLineStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    if (value instanceof GrLineStart) {
      this._sxStart = value
      return
    }
    this._sxStart = new GrLineStart(value.x, value.y)
  }

  get end(): GrLineEnd | undefined {
    return this._sxEnd
  }

  set end(value: GrLineEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof GrLineEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new GrLineEnd(value.x, value.y)
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: Width | number | undefined) {
    if (value === undefined) {
      this._sxWidth = undefined
      return
    }
    this._sxWidth = value instanceof Width ? value : new Width(value)
  }

  get widthClass(): Width | undefined {
    return this._sxWidth
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxWidth) children.push(this._sxWidth)
    return children
  }

  override getString(): string {
    const lines = ["(gr_line"]
    if (this._sxStart) lines.push(this._sxStart.getStringIndented())
    if (this._sxEnd) lines.push(this._sxEnd.getStringIndented())
    if (this._sxWidth) lines.push(this._sxWidth.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadPrimitiveGrLine)
