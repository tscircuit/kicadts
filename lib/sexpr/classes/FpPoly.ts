import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Layer } from "./Layer"
import { Stroke } from "./Stroke"
import { Tstamp } from "./Tstamp"
import { Uuid } from "./Uuid"
import { Width } from "./Width"
import { Pts } from "./Pts"
import { Xy } from "./Xy"
import { FpPolyFill } from "./FpPolyFill"
import { FpPolyLocked } from "./FpPolyLocked"

const SUPPORTED_TOKENS = new Set([
  "pts",
  "xy",
  "layer",
  "width",
  "stroke",
  "fill",
  "locked",
  "tstamp",
  "uuid",
])

export interface FpPolyConstructorParams {
  points?: Pts | Xy[] | Array<{ x: number; y: number }>
  layer?: Layer | string | Array<string | number>
  width?: Width | number
  stroke?: Stroke
  fill?: FpPolyFill | boolean
  locked?: boolean
  tstamp?: Tstamp | string
  uuid?: Uuid | string
}

export class FpPoly extends SxClass {
  static override token = "fp_poly"
  override token = "fp_poly"

  private _sxPts?: Pts
  private _sxLayer?: Layer
  private _sxWidth?: Width
  private _sxStroke?: Stroke
  private _sxFill?: FpPolyFill
  private _sxLocked?: FpPolyLocked
  private _sxTstamp?: Tstamp
  private _sxUuid?: Uuid

  constructor(params: FpPolyConstructorParams = {}) {
    super()
    if (params.points !== undefined) this.points = params.points
    if (params.layer !== undefined) this.layer = params.layer
    if (params.width !== undefined) this.width = params.width
    if (params.stroke !== undefined) this.stroke = params.stroke
    if (params.fill !== undefined) this.fill = params.fill
    if (params.locked !== undefined) this.locked = params.locked
    if (params.tstamp !== undefined) this.tstamp = params.tstamp
    if (params.uuid !== undefined) this.uuid = params.uuid
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): FpPoly {
    const fpPoly = new FpPoly()

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
        `Unsupported child tokens inside fp_poly expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    const ptsEntries = arrayPropertyMap.pts as Pts[] | undefined
    if (ptsEntries && ptsEntries.length > 1) {
      throw new Error("fp_poly does not support repeated pts tokens")
    }

    const xyEntries = arrayPropertyMap.xy as Xy[] | undefined
    let pts = propertyMap.pts as Pts | undefined

    if (pts && xyEntries && xyEntries.length > 0) {
      throw new Error("fp_poly cannot mix pts and xy child tokens")
    }

    if (!pts && ptsEntries?.length) {
      pts = ptsEntries[0]
    }

    if (!pts && xyEntries && xyEntries.length > 0) {
      pts = new Pts(xyEntries)
    }

    fpPoly._sxPts = pts
    fpPoly._sxLayer = propertyMap.layer as Layer | undefined
    fpPoly._sxWidth = propertyMap.width as Width | undefined
    fpPoly._sxStroke = propertyMap.stroke as Stroke | undefined
    fpPoly._sxFill = propertyMap.fill as FpPolyFill | undefined
    const lockedClass = propertyMap.locked as FpPolyLocked | undefined
    fpPoly._sxLocked =
      lockedClass && lockedClass.value ? lockedClass : undefined
    fpPoly._sxTstamp = propertyMap.tstamp as Tstamp | undefined
    fpPoly._sxUuid = propertyMap.uuid as Uuid | undefined

    for (const primitive of primitiveSexprs) {
      if (primitive === "locked") {
        if (!fpPoly._sxLocked) {
          fpPoly._sxLocked = new FpPolyLocked(true)
        }
        continue
      }

      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `fp_poly encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
        )
      }

      const [token, ...rest] = primitive
      if (typeof token !== "string") {
        throw new Error(
          `fp_poly child token must be a string, received: ${JSON.stringify(token)}`,
        )
      }

      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child token inside fp_poly expression: ${token}`,
        )
      }

      if (token === "locked" && !fpPoly._sxLocked) {
        fpPoly._sxLocked = FpPolyLocked.fromSexprPrimitives(
          rest as PrimitiveSExpr[],
        )
        if (!fpPoly._sxLocked.value) {
          fpPoly._sxLocked = undefined
        }
      }
    }

    if (!fpPoly._sxPts) {
      throw new Error("fp_poly requires pts or xy child tokens")
    }
    if (!fpPoly._sxLayer) {
      throw new Error("fp_poly requires a layer child token")
    }
    if (!fpPoly._sxUuid && !fpPoly._sxTstamp) {
      throw new Error("fp_poly requires a uuid or tstamp child token")
    }

    return fpPoly
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

    throw new Error("Unsupported points value provided to fp_poly")
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

  get fill(): FpPolyFill | undefined {
    return this._sxFill
  }

  set fill(value: FpPolyFill | boolean | undefined) {
    if (value === undefined) {
      this._sxFill = undefined
      return
    }
    if (value instanceof FpPolyFill) {
      this._sxFill = value
      return
    }
    this._sxFill = new FpPolyFill(value)
  }

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new FpPolyLocked(true) : undefined
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

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxPts) children.push(this._sxPts)
    if (this._sxLayer) children.push(this._sxLayer)
    if (this._sxWidth) children.push(this._sxWidth)
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxFill) children.push(this._sxFill)
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxTstamp) children.push(this._sxTstamp)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(FpPoly)
