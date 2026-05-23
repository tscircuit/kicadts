import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { Xy } from "./Xy"

const SUPPORTED_TOKENS = new Set([
  "pts",
  "xy",
  "layer",
  "width",
  "stroke",
  "tstamp",
  "uuid",
  "locked",
])

export interface FpCurveConstructorParams {
  points?: Pts | Xy[] | Array<{ x: number; y: number }>
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  tstamp?: Tstamp | string
  uuid?: Uuid | string
  locked?: boolean
}

export class FpCurve extends SxClass {
  static override token = "fp_curve"
  static override parentToken = "footprint"
  override token = "fp_curve"

  private _sxPts?: Pts
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid
  private _locked = false

  constructor(params: FpCurveConstructorParams = {}) {
    super()
    if (params.points !== undefined) this.points = params.points
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCurve {
    const fpCurve = new FpCurve()
    const structuredPrimitives: PrimitiveSExpr[] = []

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "locked") {
          if (fpCurve._locked) {
            throw new Error("fp_curve encountered duplicate locked flags")
          }
          fpCurve._locked = true
          continue
        }
        throw new Error(`fp_curve encountered unsupported flag "${primitive}"`)
      }

      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `fp_curve encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      structuredPrimitives.push(primitive)
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(structuredPrimitives, this.token)

    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `fp_curve encountered unsupported child token "${token}"`,
        )
      }
    }

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `fp_curve encountered unsupported child token "${token}"`,
        )
      }
      if (token !== "xy" && entries.length > 1) {
        throw new Error(
          `fp_curve does not support repeated child token "${token}"`,
        )
      }
    }

    const ptsEntries = arrayPropertyMap.pts as Pts[] | undefined
    const xyEntries = arrayPropertyMap.xy as Xy[] | undefined
    let pts = propertyMap.pts as Pts | undefined

    if (pts && xyEntries && xyEntries.length > 0) {
      throw new Error("fp_curve cannot mix pts and xy child tokens")
    }

    if (!pts && ptsEntries?.length) {
      pts = ptsEntries[0]
    }

    if (!pts && xyEntries && xyEntries.length > 0) {
      pts = new Pts(xyEntries)
    }

    fpCurve._sxPts = pts
    fpCurve._sxLayer = propertyMap.layer as Layer | undefined
    fpCurve._sxWidth = propertyMap.width as Width | undefined
    fpCurve._sxStroke = propertyMap.stroke as Stroke | undefined
    fpCurve._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    fpCurve._sxUuid = propertyMap.uuid as Uuid | undefined
    const locked = propertyMap.locked as FpCurveLocked | undefined
    fpCurve._locked = fpCurve._locked || (locked?.value ?? false)

    if (!fpCurve._sxPts) {
      throw new Error("fp_curve requires pts or xy child tokens")
    }
    if (!fpCurve._sxLayer) {
      throw new Error("fp_curve requires a layer child token")
    }

    return fpCurve
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
    throw new Error("Unsupported points value provided to fp_curve")
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

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
  }

  get tstamp(): Tstamp | undefined {
    return this._sxTstamp
  }

  set tstamp(value: Tstamp | string | undefined) {
    if (value === undefined) {
      this._sxTstamp = undefined
      return
    }
    this._sxTstamp = value instanceof Tstamp ? value : new Tstamp(value)
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  get locked(): boolean {
    return this._locked
  }

  set locked(value: boolean) {
    this._locked = value
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxStroke) {
      children.push(this._sxStroke)
    } else if (this._sxWidth) {
      children.push(this._sxWidth)
    }
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._locked) children.push(new FpCurveLocked(true))
    return children
  }
}
SxClass.register(FpCurve)

export class FpCurveLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "fp_curve"
  override token = "locked"

  constructor(public value = true) {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpCurveLocked {
    if (primitiveSexprs.length === 0) {
      return new FpCurveLocked(true)
    }
    return new FpCurveLocked(
      primitiveSexprs[0] === true ||
        primitiveSexprs[0] === "yes" ||
        primitiveSexprs[0] === "true",
    )
  }

  override getString(): string {
    return "(locked)"
  }
}
SxClass.register(FpCurveLocked)
