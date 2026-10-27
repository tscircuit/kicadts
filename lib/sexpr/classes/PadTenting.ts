import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { Back } from "./Setup/Back"
import { Front } from "./Setup/Front"

export interface PadTentingConstructorParams {
  front?: Front | string
  back?: Back | string
  sides?: string[]
}

export class PadTenting extends SxClass {
  static override token = "tenting"
  static override parentToken = "pad"
  override token = "tenting"

  private _sides: string[] = []
  private _sxFront?: Front
  private _sxBack?: Back

  constructor(params: PadTentingConstructorParams | string[] = {}) {
    super()
    if (Array.isArray(params)) {
      this.sides = params
      return
    }
    if (params.sides !== undefined) this.sides = params.sides
    if (params.front !== undefined) this.front = params.front
    if (params.back !== undefined) this.back = params.back
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadTenting {
    if (primitiveSexprs.some((primitive) => Array.isArray(primitive))) {
      const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
        primitiveSexprs,
        this.token,
      )

      return new PadTenting({
        front: propertyMap.front as Front | undefined,
        back: propertyMap.back as Back | undefined,
      })
    }

    const sides = primitiveSexprs.map((primitive) => {
      const side = toStringValue(primitive)
      if (side === undefined) {
        throw new Error("pad tenting expects side name strings")
      }
      return side
    })
    return new PadTenting(sides)
  }

  get sides(): string[] {
    return [...this._sides]
  }

  set sides(sides: string[]) {
    this._sides = sides.map((side) => String(side))
  }

  get front(): string | undefined {
    return this._sxFront?.value
  }

  set front(value: Front | string | undefined) {
    if (value === undefined) {
      this._sxFront = undefined
      return
    }
    this._sxFront = value instanceof Front ? value : new Front(value)
  }

  get back(): string | undefined {
    return this._sxBack?.value
  }

  set back(value: Back | string | undefined) {
    if (value === undefined) {
      this._sxBack = undefined
      return
    }
    this._sxBack = value instanceof Back ? value : new Back(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFront) children.push(this._sxFront)
    if (this._sxBack) children.push(this._sxBack)
    return children
  }

  override getString(): string {
    if (this._sxFront || this._sxBack) {
      return super.getString()
    }
    if (this._sides.length === 0) {
      return "(tenting)"
    }
    return `(tenting ${this._sides.join(" ")})`
  }
}
SxClass.register(PadTenting)
