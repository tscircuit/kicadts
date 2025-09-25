import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export type StandardPaperSize =
  | "A0"
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "A5"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"

export class Paper extends SxClass {
  static override token = "paper"
  token = "paper"

  private _size?: StandardPaperSize | string
  private _width?: number
  private _height?: number
  private _portrait = false

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Paper {
    const paper = new Paper()

    const numericArgs: number[] = []

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "number") {
        numericArgs.push(primitive)
        continue
      }

      if (typeof primitive === "string") {
        if (primitive === "portrait") {
          paper._portrait = true
          continue
        }

        if (paper._size === undefined && numericArgs.length === 0) {
          paper._size = primitive as StandardPaperSize | string
        }
      }
    }

    if (numericArgs.length >= 2) {
      paper._width = numericArgs[0]
      paper._height = numericArgs[1]
    } else if (numericArgs.length === 1) {
      paper._width = numericArgs[0]
    }

    return paper
  }

  get size(): string | undefined {
    return this._size
  }

  set size(value: string | undefined) {
    this._size = value
    if (value !== undefined) {
      this._width = undefined
      this._height = undefined
    }
  }

  get customSize(): { width: number; height: number } | undefined {
    if (typeof this._width === "number" && typeof this._height === "number") {
      return { width: this._width, height: this._height }
    }
    return undefined
  }

  set customSize(size: { width: number; height: number } | undefined) {
    if (!size) {
      this._width = undefined
      this._height = undefined
      return
    }
    this._width = size.width
    this._height = size.height
    this._size = undefined
  }

  get isPortrait(): boolean {
    return this._portrait
  }

  set isPortrait(value: boolean) {
    this._portrait = value
  }

  override getString(): string {
    const lines = ["(paper"]

    if (this._size) {
      lines.push(`  ${this._size}`)
    } else if (
      typeof this._width === "number" &&
      typeof this._height === "number"
    ) {
      lines.push(`  ${this._width} ${this._height}`)
    }

    if (this._portrait) {
      lines.push("  portrait")
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Paper)
