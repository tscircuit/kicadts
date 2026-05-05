import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Front } from "./Front"
import { Back } from "./Back"

export class Covering extends SxClass {
  static override token = "covering"
  token = "covering"

  private _sxFront?: Front
  private _sxBack?: Back

  constructor(opts: { front?: boolean; back?: boolean } = {}) {
    super()
    if (opts.front !== undefined) this._sxFront = new Front(opts.front)
    if (opts.back !== undefined) this._sxBack = new Back(opts.back)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Covering {
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    const covering = new Covering()
    covering._sxFront = propertyMap.front as Front
    covering._sxBack = propertyMap.back as Back
    return covering
  }

  get front(): boolean | undefined {
    return this._sxFront?.value
  }

  set front(value: boolean | undefined) {
    this._sxFront = value !== undefined ? new Front(value) : undefined
  }

  get back(): boolean | undefined {
    return this._sxBack?.value
  }

  set back(value: boolean | undefined) {
    this._sxBack = value !== undefined ? new Back(value) : undefined
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFront) children.push(this._sxFront)
    if (this._sxBack) children.push(this._sxBack)
    return children
  }
}
SxClass.register(Covering)
