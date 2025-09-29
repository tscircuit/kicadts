import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class PadNet extends SxClass {
  static override token = "net"
  static override parentToken = "pad"
  token = "net"

  private _id: number
  private _name: string

  constructor(id: number, name: string) {
    super()
    this._id = id
    this._name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadNet {
    const id = toNumberValue(primitiveSexprs[0])
    const name = toStringValue(primitiveSexprs[1])
    if (id === undefined || name === undefined) {
      throw new Error("pad net requires numeric id and string name")
    }
    return new PadNet(id, name)
  }

  get id(): number {
    return this._id
  }

  set id(value: number) {
    this._id = value
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return `(net ${this._id} ${quoteSExprString(this._name)})`
  }
}
SxClass.register(PadNet)
