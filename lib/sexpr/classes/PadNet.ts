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
  private _name?: string

  constructor(idOrName: number | string, name?: string) {
    super()
    if (typeof idOrName === "number") {
      this._id = idOrName
      this._name = name
      return
    }
    this._name = idOrName
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PadNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id !== undefined) {
      const name = toStringValue(primitiveSexprs[1])
      if (name === undefined) {
        throw new Error("pad net requires a string name with numeric id")
      }
      return new PadNet(id, name)
    }

    const name = toStringValue(primitiveSexprs[0])
    if (name === undefined) {
      throw new Error("pad net requires numeric id or string name")
    }
    return new PadNet(name)
  }

  get id(): number | undefined {
    return this._id
  }

  set id(value: number | undefined) {
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
    if (this._id === undefined) {
      return `(net ${quoteSExprString(this._name ?? "")})`
    }
    return `(net ${this._id} ${quoteSExprString(this._name)})`
  }
}
SxClass.register(PadNet)
