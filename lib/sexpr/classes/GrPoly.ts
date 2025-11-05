import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { Pts } from "./Pts"
import { Xy } from "./Xy"
import { toStringValue } from "../utils/toStringValue"

export class GrPolyFill extends SxClass {
  static override token = "fill"
  static override parentToken = "gr_poly"
  override token = "fill"

  filled: boolean

  constructor(filled: boolean) {
    super()
    this.filled = filled
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrPolyFill {
    const state = toStringValue(primitiveSexprs[0])
    return new GrPolyFill(state === "yes")
  }

  override getString(): string {
    return `(fill ${this.filled ? "yes" : "no"})`
  }
}
SxClass.register(GrPolyFill)

const SUPPORTED_TOKENS = new Set([
  "pts",
  "xy",
  "layer",
  "width",
  "stroke",
  "fill",
  "uuid",
])

export interface GrPolyConstructorParams {
  points?: Pts | Xy[] | Array<{ x: number; y: number }>
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  fill?: GrPolyFill | boolean
  uuid?: Uuid | string
}

export class GrPoly extends SxClass {
  static override token = "gr_poly"
  override token = "gr_poly"

  private _sxPts?: Pts
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: GrPolyFill
  private _sxUuid?: Uuid

  constructor(params: GrPolyConstructorParams = {}) {
    super()
    if (params.points !== undefined) this.points = params.points
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GrPoly {
    const grPoly = new GrPoly()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    const unexpectedTokens = new Set<string>()
    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        unexpectedTokens.add(token)
      }
    }
    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        unexpectedTokens.add(token)
      }
      if (token !== "xy" && arrayPropertyMap[token]!.length > 1) {
        unexpectedTokens.add(token)
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside gr_poly expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    const ptsEntries = arrayPropertyMap.pts as Pts[] | undefined
    if (ptsEntries && ptsEntries.length > 1) {
      throw new Error("gr_poly does not support repeated pts tokens")
    }

    const xyEntries = arrayPropertyMap.xy as Xy[] | undefined
    let pts = propertyMap.pts as Pts | undefined

    if (pts && xyEntries && xyEntries.length > 0) {
      throw new Error("gr_poly cannot mix pts and xy child tokens")
    }

    if (!pts && ptsEntries?.length) {
      pts = ptsEntries[0]
    }

    if (!pts && xyEntries && xyEntries.length > 0) {
      pts = new Pts(xyEntries)
    }

    grPoly._sxPts = pts
    grPoly._sxLayer = propertyMap.layer as Layer | undefined
    grPoly._sxWidth = propertyMap.width as Width | undefined
    grPoly._sxStroke = propertyMap.stroke as Stroke | undefined
    grPoly._sxFill = propertyMap.fill as GrPolyFill | undefined
    grPoly._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `gr_poly encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }

      const [token, ...rest] = primitive
      if (typeof token !== "string") {
        throw new Error(
          `gr_poly child token must be a string, received: ${JSON.stringify(token)}`,
        )
      }

      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child token inside gr_poly expression: ${token}`,
        )
      }
    }

    if (!grPoly._sxPts) {
      throw new Error("gr_poly requires pts or xy child tokens")
    }
    if (!grPoly._sxLayer) {
      throw new Error("gr_poly requires a layer child token")
    }

    return grPoly
  }

  get points(): Pts | undefined {
    return this._sxPts
  }

  set points(value: Pts | Xy[] | Array<{ x: number; y: number }> | undefined) {
    if (value === undefined) {
      this._sxPts = undefined
      return
    }

    if (value instanceof Pts) {
      this._sxPts = value
      return
    }

    if (Array.isArray(value) && value.every((point) => point instanceof Xy)) {
      this._sxPts = new Pts(value as Xy[])
      return
    }

    if (Array.isArray(value)) {
      this._sxPts = new Pts(value.map(({ x, y }) => new Xy(x, y)))
      return
    }

    throw new Error("Unsupported points value provided to gr_poly")
  }

  get layer(): Layer | undefined {
    return this._sxLayer
  }

  set layer(value: Layer | string | Array<string | number> | undefined) {
    if (value === undefined) {
      this._sxLayer = undefined
      return
    }
    if (value instanceof Layer) {
      this._sxLayer = value
      return
    }
    const names = Array.isArray(value) ? value : [value]
    this._sxLayer = new Layer(names)
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

  set widthClass(value: Width | undefined) {
    this._sxWidth = value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get fill(): boolean | undefined {
    if (!this._sxFill) return undefined
    // Handle both GrPolyFill and potential PadPrimitiveFill conflict
    if ("filled" in this._sxFill) {
      return (this._sxFill as any).filled
    }
    if ("value" in this._sxFill) {
      return (this._sxFill as any).value
    }
    return undefined
  }

  set fill(value: GrPolyFill | boolean | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof GrPolyFill) {
      this._sxFill = value
      return
    }
    this._sxFill = new GrPolyFill(value)
  }

  get fillClass(): GrPolyFill | undefined {
    return this._sxFill
  }

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  get uuidClass(): Uuid | undefined {
    return this._sxUuid
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(GrPoly)
