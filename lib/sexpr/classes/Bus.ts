import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import type { Pts } from "./Pts"
import type { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set(["pts", "stroke", "uuid"])

export interface BusConstructorParams {
  points?: Pts
  stroke?: Stroke
  uuid?: string | Uuid
}

export class Bus extends SxClass {
  static override token = "bus"
  static override parentToken = "kicad_sch"
  override token = "bus"

  private _sxPts?: Pts
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid

  constructor(params: BusConstructorParams = {}) {
    super()

    if (params.points !== undefined) {
      this.points = params.points
    }

    if (params.stroke !== undefined) {
      this.stroke = params.stroke
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }
  }

  static override fromSexprPrimitives(primitiveSexprs: PrimitiveSExpr[]): Bus {
    const bus = new Bus()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        throw new Error(
          `Unsupported child tokens inside bus expression: ${token}`,
        )
      }
      if (entries.length > 1) {
        throw new Error(`bus does not support repeated child tokens: ${token}`)
      }
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside bus expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    bus._sxPts =
      (arrayPropertyMap.pts?.[0] as Pts | undefined) ??
      (propertyMap.pts as Pts | undefined)
    bus._sxStroke =
      (arrayPropertyMap.stroke?.[0] as Stroke | undefined) ??
      (propertyMap.stroke as Stroke | undefined)
    bus._sxUuid =
      (arrayPropertyMap.uuid?.[0] as Uuid | undefined) ??
      (propertyMap.uuid as Uuid | undefined)

    return bus
  }

  get points(): Pts | undefined {
    return this._sxPts
  }

  set points(value: Pts | undefined) {
    this._sxPts = value
  }

  get stroke(): Stroke | undefined {
    return this._sxStroke
  }

  set stroke(value: Stroke | undefined) {
    this._sxStroke = value
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
    if (this._sxStroke) children.push(this._sxStroke)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(Bus)
