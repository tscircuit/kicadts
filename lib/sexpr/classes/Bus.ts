import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Pts } from "./Pts"
import { Stroke } from "./Stroke"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set(["pts", "stroke", "uuid"])

export class Bus extends SxClass {
  static override token = "bus"
  static override parentToken = "kicad_sch"
  override token = "bus"

  private _sxPts?: Pts
  private _sxStroke?: Stroke
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Bus {
    const bus = new Bus()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    if (Object.keys(arrayPropertyMap).length > 0) {
      const tokens = Object.keys(arrayPropertyMap).join(", ")
      throw new Error(`bus does not support repeated child tokens: ${tokens}`)
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside bus expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    bus._sxPts = propertyMap.pts as Pts | undefined
    bus._sxStroke = propertyMap.stroke as Stroke | undefined
    bus._sxUuid = propertyMap.uuid as Uuid | undefined

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
