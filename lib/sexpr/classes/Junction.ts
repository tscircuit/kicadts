import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Color } from "./Color"
import { Uuid } from "./Uuid"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

const SUPPORTED_TOKENS = new Set(["at", "diameter", "color", "uuid"])

export class Junction extends SxClass {
  static override token = "junction"
  static override parentToken = "kicad_sch"
  override token = "junction"

  private _sxAt?: At
  private _sxDiameter?: JunctionDiameter
  private _sxColor?: Color
  private _sxUuid?: Uuid

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Junction {
    const junction = new Junction()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    if (Object.keys(arrayPropertyMap).length > 0) {
      const tokens = Object.keys(arrayPropertyMap).join(", ")
      throw new Error(
        `junction does not support repeated child tokens: ${tokens}`,
      )
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside junction expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    junction._sxAt = propertyMap.at as At | undefined
    junction._sxDiameter = propertyMap.diameter as JunctionDiameter | undefined
    junction._sxColor = propertyMap.color as Color | undefined
    junction._sxUuid = propertyMap.uuid as Uuid | undefined

    return junction
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: At | undefined) {
    this._sxAt = value
  }

  get diameter(): number | undefined {
    return this._sxDiameter?.value
  }

  set diameter(value: number | undefined) {
    this._sxDiameter = value === undefined ? undefined : new JunctionDiameter(value)
  }

  get color(): Color | undefined {
    return this._sxColor
  }

  set color(value: Color | undefined) {
    this._sxColor = value
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
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxDiameter) children.push(this._sxDiameter)
    if (this._sxColor) children.push(this._sxColor)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(Junction)

export class JunctionDiameter extends SxPrimitiveNumber {
  static override token = "diameter"
  static override parentToken = "junction"
  override token = "diameter"
}
SxClass.register(JunctionDiameter)
