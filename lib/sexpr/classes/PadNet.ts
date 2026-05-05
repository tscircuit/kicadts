import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class PadNet extends SxClass {
  static override token = "net"
  static override parentToken = "pad"
  token = "net"

  private _id?: number
  private _name: string

  constructor(name: string, id?: number) {
    super()
    this._id = id
    this._name = name
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadNet {
    const first = primitiveSexprs[0]
    const second = primitiveSexprs[1]

    if (typeof first === "number" && typeof second === "string") {
      return new PadNet(second, first)
    }

    const name = toStringValue(first)
    if (name === undefined) {
      throw new Error(`pad net requires a name, got: ${JSON.stringify(first)}`)
    }
    return new PadNet(name)
  }

  get id(): number | undefined {
    return this._id
  }

  set id(value: number | undefined) {
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
    if (this._id !== undefined) {
      return `(net ${this._id} ${quoteSExprString(this._name)})`
    }
    return `(net ${quoteSExprString(this._name)})`
  }
}
SxClass.register(PadNet)
