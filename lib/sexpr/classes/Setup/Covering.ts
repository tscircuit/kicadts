import { SxClass } from "../../base-classes/SxClass"
import type { PrimitiveSExpr } from "../../parseToPrimitiveSExpr"

import { Back } from "./Back"
import { Front } from "./Front"

export class Covering extends SxClass {
  static override token = "covering"
  token = "covering"

  private _sxFront?: Front
  private _sxBack?: Back

  constructor(params: { front?: Front | string; back?: Back | string } = {}) {
    super()
    if (params.front !== undefined) this.front = params.front
    if (params.back !== undefined) this.back = params.back
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Covering {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    return new Covering({
      front: propertyMap.front as Front | undefined,
      back: propertyMap.back as Back | undefined,
    })
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
}
SxClass.register(Covering)
