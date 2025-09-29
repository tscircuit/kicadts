import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Width } from "./Width"
import { toNumberValue } from "../utils/toNumberValue"

const SUPPORTED_TOKENS = new Set(["center", "end", "width", "fill"])

export class PadPrimitiveGrCircle extends SxClass {
  static override token = "gr_circle"
  static override parentToken = "primitives"
  override token = "gr_circle"

  private _sxCenter?: PadPrimitiveGrCircleCenter
  private _sxEnd?: PadPrimitiveGrCircleEnd
  private _sxWidth?: Width
  private _sxFill?: PadPrimitiveGrCircleFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrCircle {
    const circle = new PadPrimitiveGrCircle()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_circle encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `pad primitive gr_circle encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `pad primitive gr_circle does not support repeated "${token}" tokens`,
        )
      }
    }

    circle._sxCenter = propertyMap.center as
      | PadPrimitiveGrCircleCenter
      | undefined
    circle._sxEnd = propertyMap.end as PadPrimitiveGrCircleEnd | undefined
    circle._sxWidth = propertyMap.width as Width | undefined
    circle._sxFill = propertyMap.fill as PadPrimitiveGrCircleFill | undefined

    if (!circle._sxCenter) {
      throw new Error("pad primitive gr_circle requires a center child token")
    }
    if (!circle._sxEnd) {
      throw new Error("pad primitive gr_circle requires an end child token")
    }

    return circle
  }

  get center(): PadPrimitiveGrCircleCenter | undefined {
    return this._sxCenter
  }

  set center(
    value: PadPrimitiveGrCircleCenter | { x: number; y: number } | undefined,
  ) {
    this._sxCenter = normalizeCirclePoint(value, PadPrimitiveGrCircleCenter)
  }

  get end(): PadPrimitiveGrCircleEnd | undefined {
    return this._sxEnd
  }

  set end(value: PadPrimitiveGrCircleEnd | { x: number; y: number } | undefined) {
    this._sxEnd = normalizeCirclePoint(value, PadPrimitiveGrCircleEnd)
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

  get fill(): boolean | undefined {
    return this._sxFill?.value
  }

  set fill(value: PadPrimitiveGrCircleFill | boolean | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    this._sxFill =
      value instanceof PadPrimitiveGrCircleFill
        ? value
        : new PadPrimitiveGrCircleFill(value)
  }

  get fillClass(): PadPrimitiveGrCircleFill | undefined {
    return this._sxFill
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxCenter) children.push(this._sxCenter)
    if (this._sxEnd) children.push(this._sxEnd)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }

  override getString(): string {
    const lines = ["(gr_circle"]
    if (this._sxCenter) lines.push(this._sxCenter.getStringIndented())
    if (this._sxEnd) lines.push(this._sxEnd.getStringIndented())
    if (this._sxWidth) lines.push(this._sxWidth.getStringIndented())
    if (this._sxFill) lines.push(this._sxFill.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PadPrimitiveGrCircle)

type CirclePointConstructor<T extends PadPrimitiveGrCirclePoint> = new (
  x: number,
  y: number,
) => T

const normalizeCirclePoint = <T extends PadPrimitiveGrCirclePoint>(
  value: T | { x: number; y: number } | undefined,
  Constructor: CirclePointConstructor<T>,
): T | undefined => {
  if (value === undefined) {
    return undefined
  }
  if (value instanceof Constructor) {
    return value
  }
  return new Constructor(value.x, value.y)
}

abstract class PadPrimitiveGrCirclePoint extends SxClass {
  protected _x: number
  protected _y: number

  constructor(token: string, x: number, y: number) {
    super()
    this.token = token
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

class PadPrimitiveGrCircleCenter extends PadPrimitiveGrCirclePoint {
  static override token = "center"
  static override parentToken = "gr_circle"

  constructor(x: number, y: number) {
    super("center", x, y)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrCircleCenter {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error(
        "pad primitive gr_circle center expects two numeric arguments",
      )
    }

    return new PadPrimitiveGrCircleCenter(x, y)
  }
}
SxClass.register(PadPrimitiveGrCircleCenter)

class PadPrimitiveGrCircleEnd extends PadPrimitiveGrCirclePoint {
  static override token = "end"
  static override parentToken = "gr_circle"

  constructor(x: number, y: number) {
    super("end", x, y)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrCircleEnd {
    const [rawX, rawY] = primitiveSexprs
    const x = toNumberValue(rawX)
    const y = toNumberValue(rawY)

    if (x === undefined || y === undefined) {
      throw new Error(
        "pad primitive gr_circle end expects two numeric arguments",
      )
    }

    return new PadPrimitiveGrCircleEnd(x, y)
  }
}
SxClass.register(PadPrimitiveGrCircleEnd)

class PadPrimitiveGrCircleFill extends SxPrimitiveBoolean {
  static override token = "fill"
  static override parentToken = "gr_circle"
  override token = "fill"

  constructor(value?: boolean) {
    super(value ?? false)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrCircleFill {
    const [raw] = primitiveSexprs
    if (raw === undefined) {
      return new PadPrimitiveGrCircleFill(false)
    }
    if (typeof raw === "boolean") {
      return new PadPrimitiveGrCircleFill(raw)
    }
    if (typeof raw === "string") {
      const normalized = raw.toLowerCase()
      if (normalized === "yes" || normalized === "true") {
        return new PadPrimitiveGrCircleFill(true)
      }
      if (normalized === "no" || normalized === "false") {
        return new PadPrimitiveGrCircleFill(false)
      }
    }
    throw new Error(
      `pad primitive gr_circle fill expects yes/no or boolean, received ${JSON.stringify(raw)}`,
    )
  }
}
SxClass.register(PadPrimitiveGrCircleFill)
