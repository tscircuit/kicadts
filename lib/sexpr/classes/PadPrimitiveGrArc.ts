import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"

const SUPPORTED_TOKENS = new Set(["start", "mid", "end", "width"])

export class PadPrimitiveGrArc extends SxClass {
  static override token = "gr_arc"
  static override parentToken = "primitives"
  override token = "gr_arc"

  private _sxStart?: PadPrimitiveGrArcStart
  private _sxMid?: PadPrimitiveGrArcMid
  private _sxEnd?: PadPrimitiveGrArcEnd
  private _sxWidth?: Width

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrArc {
    const arc = new PadPrimitiveGrArc()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_arc encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_arc encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `pad primitive gr_arc does not support repeated "${token}" tokens`,
        )
      }
    }

    arc._sxStart = propertyMap.start as PadPrimitiveGrArcStart | undefined
    arc._sxMid = propertyMap.mid as PadPrimitiveGrArcMid | undefined
    arc._sxEnd = propertyMap.end as PadPrimitiveGrArcEnd | undefined
    arc._sxWidth = propertyMap.width as Width | undefined

    if (!arc._sxStart) {
      throw new Error("pad primitive gr_arc requires a start child token")
    }
    if (!arc._sxMid) {
      throw new Error("pad primitive gr_arc requires a mid child token")
    }
    if (!arc._sxEnd) {
      throw new Error("pad primitive gr_arc requires an end child token")
    }

    return arc
  }

  get start(): PadPrimitiveGrArcStart | undefined {
    return this._sxStart
  }

  set start(value:
    | PadPrimitiveGrArcStart
    | { x: number; y: number }
    | undefined,) {
    this._sxStart = normalizeArcPoint(value, PadPrimitiveGrArcStart)
  }

  get mid(): PadPrimitiveGrArcMid | undefined {
    return this._sxMid
  }

  set mid(value: PadPrimitiveGrArcMid | { x: number; y: number } | undefined) {
    this._sxMid = normalizeArcPoint(value, PadPrimitiveGrArcMid)
  }

  get end(): PadPrimitiveGrArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: PadPrimitiveGrArcEnd | { x: number; y: number } | undefined) {
    this._sxEnd = normalizeArcPoint(value, PadPrimitiveGrArcEnd)
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
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxWidth) children.push(this._sxWidth)
    return children
  }

  override getString(): string {
    const lines = ["(gr_arc"]
    if (this._sxStart) lines.push(this._sxStart.getStringIndented())
    if (this._sxMid) lines.push(this._sxMid.getStringIndented())
    if (this._sxEnd) lines.push(this._sxEnd.getStringIndented())
    if (this._sxWidth) lines.push(this._sxWidth.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadPrimitiveGrArc)

type ArcPointConstructor<T extends PadPrimitiveGrArcPoint> = new (
  x: number,
  y: number,
) => T

const normalizeArcPoint = <T extends PadPrimitiveGrArcPoint>(
  value: T | { x: number; y: number } | undefined,
  Constructor: ArcPointConstructor<T>,
): T | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (value instanceof Constructor) {
    return value
  }
  return new Constructor(value.x, value.y)
}

abstract class PadPrimitiveGrArcPoint extends SxClass {
  protected _x: number
  protected _y: number

  protected constructor(x: number, y: number) {
    super()
    this._x = x
    this._y = y
  }

  get x(): number {
    return this._x
  }

  set x(value: number) {
    this._x = value
  }

  get y(): number {
    return this._y
  }

  set y(value: number) {
    this._y = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(${this.token} ${this._x} ${this._y})`
  }
}

class PadPrimitiveGrArcStart extends PadPrimitiveGrArcPoint {
  static override token = "start"
  static override parentToken = "gr_arc"
  override token = "start"

  constructor(x: number, y: number) {
    super(x, y)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrArcStart {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error(
        "pad primitive gr_arc start expects two numeric arguments",
      )
    }

    return new PadPrimitiveGrArcStart(x, y)
  }
}
SxClass.register(PadPrimitiveGrArcStart)

class PadPrimitiveGrArcMid extends PadPrimitiveGrArcPoint {
  static override token = "mid"
  static override parentToken = "gr_arc"
  override token = "mid"

  constructor(x: number, y: number) {
    super(x, y)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrArcMid {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("pad primitive gr_arc mid expects two numeric arguments")
    }

    return new PadPrimitiveGrArcMid(x, y)
  }
}
SxClass.register(PadPrimitiveGrArcMid)

class PadPrimitiveGrArcEnd extends PadPrimitiveGrArcPoint {
  static override token = "end"
  static override parentToken = "gr_arc"
  override token = "end"

  constructor(x: number, y: number) {
    super(x, y)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrArcEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error("pad primitive gr_arc end expects two numeric arguments")
    }

    return new PadPrimitiveGrArcEnd(x, y)
  }
}
SxClass.register(PadPrimitiveGrArcEnd)
