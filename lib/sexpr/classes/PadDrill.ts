import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { PadDrillOffset } from "./PadDrillOffset"

export class PadDrill extends SxClass {
  static override token = "drill"
  static override parentToken = "pad"
  token = "drill"

  private _oval = false
  private _diameter: number
  private _width?: number
  private _sxOffset?: PadDrillOffset

  constructor({
    oval = false,
    diameter,
    width,
    offset,
  }: {
    oval?: boolean
    diameter: number
    width?: number
    offset?: PadDrillOffset | { x: number; y: number }
  }) {
    super()
    this._oval = oval
    this._diameter = diameter
    this._width = width
    if (offset instanceof PadDrillOffset) {
      this._sxOffset = offset
    } else if (offset) {
      this._sxOffset = new PadDrillOffset(offset.x, offset.y)
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadDrill {
    const remaining = [...primitiveSexprs]
    let oval = false
    if (remaining[0] === "oval") {
      oval = true
      remaining.shift()
    }

    const diameter = toNumberValue(remaining.shift())
    if (diameter === undefined) {
      throw new Error("drill requires a diameter value")
    }

    let width: number | undefined
    const potentialWidth = toNumberValue(remaining[0])
    if (potentialWidth !== undefined) {
      width = potentialWidth
      remaining.shift()
    }

    const drill = new PadDrill({ oval, diameter, width })

    for (const primitive of remaining) {
      if (!Array.isArray(primitive)) {
        throw new Error(
          `drill encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }
      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })
      if (!(parsed instanceof PadDrillOffset)) {
        throw new Error(
          `drill encountered unsupported child token: ${printSExpr(primitive)}`,
        )
      }
      if (drill._sxOffset) {
        throw new Error("drill does not support multiple offset children")
      }
      drill._sxOffset = parsed
    }

    return drill
  }

  get oval(): boolean {
    return this._oval
  }

  set oval(value: boolean) {
    this._oval = value
  }

  get diameter(): number {
    return this._diameter
  }

  set diameter(value: number) {
    this._diameter = value
  }

  get width(): number | undefined {
    return this._width
  }

  set width(value: number | undefined) {
    this._width = value
  }

  get offset(): PadDrillOffset | undefined {
    return this._sxOffset
  }

  set offset(value: PadDrillOffset | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxOffset = undefined
      return
    }
    this._sxOffset =
      value instanceof PadDrillOffset
        ? value
        : new PadDrillOffset(value.x, value.y)
  }

  override getChildren(): SxClass[] {
    return this._sxOffset ? [this._sxOffset] : []
  }

  override getString(): string {
    const tokens: string[] = []
    if (this._oval) tokens.push("oval")
    tokens.push(String(this._diameter))
    if (this._width !== undefined) tokens.push(String(this._width))

    if (!this._sxOffset) {
      return `(drill ${tokens.join(" ")})`
    }

    const lines = [`(drill ${tokens.join(" ")}`]
    lines.push(this._sxOffset.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadDrill)
