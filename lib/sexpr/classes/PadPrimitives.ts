import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"
import { Width } from "./Width"

type PadPrimitiveGraphic = PadPrimitiveGrPoly

export class PadPrimitives extends SxClass {
  static override token = "primitives"
  static override parentToken = "pad"
  override token = "primitives"

  private _graphics: PadPrimitiveGraphic[] = []
  private _sxWidth?: Width
  private _sxFill?: PadPrimitivesFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitives {
    const primitives = new PadPrimitives()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `pad primitives encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `pad primitives child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
        )
      }

      if (parsed instanceof Width) {
        if (primitives._sxWidth) {
          throw new Error("pad primitives encountered duplicate width tokens")
        }
        primitives._sxWidth = parsed
        continue
      }

      if (parsed instanceof PadPrimitivesFill) {
        if (primitives._sxFill) {
          throw new Error("pad primitives encountered duplicate fill tokens")
        }
        primitives._sxFill = parsed
        continue
      }

      if (parsed instanceof PadPrimitiveGrPoly) {
        primitives._graphics.push(parsed)
        continue
      }

      throw new Error(`pad primitives encountered unsupported token "${parsed.token}"`)
    }

    return primitives
  }

  get graphics(): PadPrimitiveGraphic[] {
    return [...this._graphics]
  }

  set graphics(value: PadPrimitiveGraphic[]) {
    this._graphics = [...value]
  }

  addGraphic(graphic: PadPrimitiveGraphic) {
    this._graphics.push(graphic)
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: number | undefined) {
    this._sxWidth = value === undefined ? undefined : new Width(value)
  }

  get fill(): boolean | undefined {
    return this._sxFill?.value
  }

  set fill(value: boolean | undefined) {
    this._sxFill =
      value === undefined ? undefined : new PadPrimitivesFill({ value })
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._graphics)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(PadPrimitives)

class PadPrimitivesFill extends SxPrimitiveBoolean {
  static override token = "fill"
  static override parentToken = "primitives"
  override token = "fill"

  constructor(options: { value?: boolean } = {}) {
    super(options.value ?? false)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitivesFill {
    const [raw] = primitiveSexprs
    const normalized = typeof raw === "string" ? raw.toLowerCase() : raw
    if (normalized === undefined) {
      return new PadPrimitivesFill({ value: false })
    }
    if (normalized === "yes") {
      return new PadPrimitivesFill({ value: true })
    }
    if (normalized === "no") {
      return new PadPrimitivesFill({ value: false })
    }
    if (typeof normalized === "boolean") {
      return new PadPrimitivesFill({ value: normalized })
    }
    throw new Error(
      `pad primitives fill expects yes/no or boolean, received ${JSON.stringify(raw)}`,
    )
  }
}
SxClass.register(PadPrimitivesFill)

export class PadPrimitiveGrPoly extends SxClass {
  static override token = "gr_poly"
  static override parentToken = "primitives"
  override token = "gr_poly"

  private _contours: Pts[] = []
  private _sxWidth?: Width
  private _sxFill?: PadPrimitiveFill

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveGrPoly {
    const polygon = new PadPrimitiveGrPoly()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `gr_poly primitive encountered invalid child: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `gr_poly primitive child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
        )
      }

      if (parsed instanceof Pts) {
        polygon._contours.push(parsed)
        continue
      }

      if (parsed instanceof Width) {
        if (polygon._sxWidth) {
          throw new Error("gr_poly encountered duplicate width tokens")
        }
        polygon._sxWidth = parsed
        continue
      }

      if (parsed instanceof PadPrimitiveFill) {
        if (polygon._sxFill) {
          throw new Error("gr_poly encountered duplicate fill tokens")
        }
        polygon._sxFill = parsed
        continue
      }

      throw new Error(`gr_poly encountered unsupported token "${parsed.token}"`)
    }

    if (polygon._contours.length === 0) {
      throw new Error("gr_poly requires at least one pts child")
    }

    return polygon
  }

  get contours(): Pts[] {
    return [...this._contours]
  }

  set contours(value: Pts[]) {
    this._contours = [...value]
  }

  get width(): number | undefined {
    return this._sxWidth?.value
  }

  set width(value: number | undefined) {
    this._sxWidth = value === undefined ? undefined : new Width(value)
  }

  get filled(): boolean | undefined {
    return this._sxFill?.value
  }

  set filled(value: boolean | undefined) {
    this._sxFill =
      value === undefined ? undefined : new PadPrimitiveFill({ value })
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    children.push(...this._contours)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    return children
  }
}
SxClass.register(PadPrimitiveGrPoly)

class PadPrimitiveFill extends SxPrimitiveBoolean {
  static override token = "fill"
  static override parentToken = "gr_poly"
  override token = "fill"

  constructor(options: { value?: boolean } = {}) {
    super(options.value ?? false)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadPrimitiveFill {
    const [raw] = primitiveSexprs
    if (raw === undefined) {
      return new PadPrimitiveFill({ value: false })
    }
    if (typeof raw === "boolean") {
      return new PadPrimitiveFill({ value: raw })
    }
    if (typeof raw === "string") {
      return new PadPrimitiveFill({ value: raw.toLowerCase() === "yes" })
    }
    throw new Error(
      `gr_poly fill expects yes/no or boolean, received ${JSON.stringify(raw)}`,
    )
  }

  override getString(): string {
    return `(fill ${this.value ? "yes" : "no"})`
  }
}
SxClass.register(PadPrimitiveFill)
