import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class ViaNet extends SxClass {
  static override token = "net"
  static override parentToken = "via"
  token = "net"

  private _id: number
  private _name?: string

  constructor(id: number, name?: string) {
    super()
    this._id = id
    this._name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): ViaNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id === undefined) {
      throw new Error("via net requires a numeric id")
    }
    const name = primitiveSexprs.length > 1 ? toStringValue(primitiveSexprs[1]) : undefined
    return new ViaNet(id, name)
  }

  get id(): number {
    return this._id
  }

  set id(value: number) {
    this._id = value
  }

  get name(): string | undefined {
    return this._name
  }

  set name(value: string | undefined) {
    this._name = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    if (this._name !== undefined) {
      return `(net ${this._id} ${quoteSExprString(this._name)})`
    }
    return `(net ${this._id})`
  }
}
SxClass.register(ViaNet)
