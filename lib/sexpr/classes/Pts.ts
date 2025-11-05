import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { Xy } from "./Xy"
import { toNumberValue } from "../utils/toNumberValue"

export class Pts extends SxClass {
  static override token = "pts"
  token = "pts"

  points: Array<Xy | PtsArc>

  constructor(points: Array<Xy | PtsArc> = []) {
    super()
    this.points = points
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Pts {
    const points: Array<Xy | PtsArc> = []

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `Unexpected primitive inside pts: ${printSExpr(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (parsed instanceof Xy) {
        points.push(parsed)
        continue
      }

      if (parsed instanceof PtsArc) {
        points.push(parsed)
        continue
      }

      if (parsed instanceof SxClass) {
        throw new Error(
          `Unsupported child "${parsed.token}" inside pts expression`,
        )
      }

      throw new Error(
        `Unable to parse child inside pts: ${printSExpr(primitive)}`,
      )
    }

    return new Pts(points)
  }

  override getChildren(): SxClass[] {
    return [...this.points]
  }

  override getString(): string {
    const lines = ["(pts"]
    for (const point of this.points) {
      const pointString = point.getString()
      const segments = pointString.split("\n")
      for (const segment of segments) {
        lines.push(`  ${segment}`)
      }
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Pts)

// Arc element that can appear inside pts
export class PtsArc extends SxClass {
  static override token = "arc"
  static override parentToken = "pts"
  override token = "arc"

  private _sxStart?: PtsArcStart
  private _sxMid?: PtsArcMid
  private _sxEnd?: PtsArcEnd

  constructor(
    params: {
      start?: PtsArcStart | { x: number; y: number }
      mid?: PtsArcMid | { x: number; y: number }
      end?: PtsArcEnd | { x: number; y: number }
    } = {},
  ) {
    super()
    if (params.start !== undefined) this.start = params.start
    if (params.mid !== undefined) this.mid = params.mid
    if (params.end !== undefined) this.end = params.end
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PtsArc {
    const arc = new PtsArc()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    arc._sxStart = propertyMap.start as PtsArcStart | undefined
    arc._sxMid = propertyMap.mid as PtsArcMid | undefined
    arc._sxEnd = propertyMap.end as PtsArcEnd | undefined

    return arc
  }

  get start(): PtsArcStart | undefined {
    return this._sxStart
  }

  set start(value: PtsArcStart | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxStart = undefined
      return
    }
    if (value instanceof PtsArcStart) {
      this._sxStart = value
      return
    }
    this._sxStart = new PtsArcStart(value.x, value.y)
  }

  get mid(): PtsArcMid | undefined {
    return this._sxMid
  }

  set mid(value: PtsArcMid | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxMid = undefined
      return
    }
    if (value instanceof PtsArcMid) {
      this._sxMid = value
      return
    }
    this._sxMid = new PtsArcMid(value.x, value.y)
  }

  get end(): PtsArcEnd | undefined {
    return this._sxEnd
  }

  set end(value: PtsArcEnd | { x: number; y: number } | undefined) {
    if (value === undefined) {
      this._sxEnd = undefined
      return
    }
    if (value instanceof PtsArcEnd) {
      this._sxEnd = value
      return
    }
    this._sxEnd = new PtsArcEnd(value.x, value.y)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxStart) children.push(this._sxStart)
    if (this._sxMid) children.push(this._sxMid)
    if (this._sxEnd) children.push(this._sxEnd)
    return children
  }

  override getString(): string {
    const lines = ["(arc"]
    if (this._sxStart) lines.push(this._sxStart.getStringIndented())
    if (this._sxMid) lines.push(this._sxMid.getStringIndented())
    if (this._sxEnd) lines.push(this._sxEnd.getStringIndented())
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(PtsArc)

export class PtsArcStart extends SxClass {
  static override token = "start"
  static override parentToken = "arc"
  override token = "start"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PtsArcStart {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new PtsArcStart(x, y)
  }

  override getString(): string {
    return `(start ${this.x} ${this.y})`
  }
}
SxClass.register(PtsArcStart)

export class PtsArcMid extends SxClass {
  static override token = "mid"
  static override parentToken = "arc"
  override token = "mid"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PtsArcMid {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new PtsArcMid(x, y)
  }

  override getString(): string {
    return `(mid ${this.x} ${this.y})`
  }
}
SxClass.register(PtsArcMid)

export class PtsArcEnd extends SxClass {
  static override token = "end"
  static override parentToken = "arc"
  override token = "end"

  constructor(
    public x: number,
    public y: number,
  ) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PtsArcEnd {
    const x = toNumberValue(primitiveSexprs[0]) ?? 0
    const y = toNumberValue(primitiveSexprs[1]) ?? 0
    return new PtsArcEnd(x, y)
  }

  override getString(): string {
    return `(end ${this.x} ${this.y})`
  }
}
SxClass.register(PtsArcEnd)
