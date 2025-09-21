import { SxClass } from "../base-classes/SxClass"
import {
  printSExpr,
  type PrimitiveSExpr,
} from "../parseToPrimitiveSExpr"

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
  static override rawArgs = true
  token = "paper"

  private _size?: StandardPaperSize | string
  private _width?: number
  private _height?: number
  portrait = false
  additionalArgs: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[]) {
    super()

    const numericArgs: number[] = []

    for (const arg of args) {
      if (typeof arg === "number") {
        numericArgs.push(arg)
        continue
      }

      if (typeof arg === "string") {
        if (arg === "portrait") {
          this.portrait = true
          continue
        }
        if (!this._size && numericArgs.length === 0) {
          this._size = arg
          continue
        }
        this.additionalArgs.push(arg)
        continue
      }

      this.additionalArgs.push(arg)
    }

    if (numericArgs.length >= 2) {
      this._width = numericArgs[0]
      this._height = numericArgs[1]
      if (numericArgs.length > 2) {
        this.additionalArgs.push(...numericArgs.slice(2))
      }
    } else if (numericArgs.length === 1) {
      this._width = numericArgs[0]
    }
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
    return this.portrait
  }

  set isPortrait(value: boolean) {
    this.portrait = value
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

    if (this.portrait) {
      lines.push("  portrait")
    }

    for (const arg of this.additionalArgs) {
      lines.push(`  ${printSExpr(arg)}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Paper)
