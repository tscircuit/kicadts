import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At } from "./At"
import { Color } from "./Color"
import { Uuid } from "./Uuid"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

const SUPPORTED_TOKENS = new Set(["at", "diameter", "color", "uuid"])

export interface JunctionConstructorParams {
  at?: At
  diameter?: number | JunctionDiameter
  color?: Color
  uuid?: string | Uuid
}

export class Junction extends SxClass {
  static override token = "junction"
  static override parentToken = "kicad_sch"
  override token = "junction"

  private _sxAt?: At
  private _sxDiameter?: JunctionDiameter
  private _sxColor?: Color
  private _sxUuid?: Uuid

  constructor(params: JunctionConstructorParams = {}) {
    super()

    if (params.at !== undefined) {
      this.at = params.at
    }

    if (params.diameter !== undefined) {
      if (params.diameter instanceof JunctionDiameter) {
        this._sxDiameter = params.diameter
      } else {
        this.diameter = params.diameter
      }
    }

    if (params.color !== undefined) {
      this.color = params.color
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Junction {
    const junction = new Junction()

    for (const primitive of primitiveSexprs) {
      if (!Array.isArray(primitive) || primitive.length === 0) {
        throw new Error(
          `junction encountered invalid child expression: ${JSON.stringify(primitive)}`,
        )
      }

      const parsed = SxClass.parsePrimitiveSexpr(primitive, {
        parentToken: this.token,
      })

      if (!(parsed instanceof SxClass)) {
        throw new Error(
          `junction child did not resolve to an SxClass: ${JSON.stringify(primitive)}`,
        )
      }

      if (parsed instanceof At) {
        if (junction._sxAt) {
          throw new Error("junction encountered duplicate at tokens")
        }
        junction._sxAt = parsed
        continue
      }

      if (parsed instanceof JunctionDiameter) {
        if (junction._sxDiameter) {
          throw new Error("junction encountered duplicate diameter tokens")
        }
        junction._sxDiameter = parsed
        continue
      }

      if (parsed instanceof Color) {
        if (junction._sxColor) {
          throw new Error("junction encountered duplicate color tokens")
        }
        junction._sxColor = parsed
        continue
      }

      if (parsed instanceof Uuid) {
        if (junction._sxUuid) {
          throw new Error("junction encountered duplicate uuid tokens")
        }
        junction._sxUuid = parsed
        continue
      }

      throw new Error(
        `Unsupported child tokens inside junction expression: ${parsed.token}`,
      )
    }

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
    this._sxDiameter =
      value === undefined ? undefined : new JunctionDiameter(value)
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
