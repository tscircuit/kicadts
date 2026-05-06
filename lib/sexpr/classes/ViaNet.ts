import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class ViaNet extends SxClass {
  static override token = "net"
  static override parentToken = "via"
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
  ): ViaNet {
    const id = toNumberValue(primitiveSexprs[0])
    if (id !== undefined) {
      const name =
        primitiveSexprs.length > 1
          ? toStringValue(primitiveSexprs[1])
          : undefined
      return new ViaNet(id, name)
    }

    const name = toStringValue(primitiveSexprs[0])
    if (name === undefined) {
      throw new Error("via net requires a numeric id or string name")
    }
    return new ViaNet(name)
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
    if (this._name !== undefined) {
      return `(net ${this._id} ${quoteSExprString(this._name)})`
    }
    return `(net ${this._id})`
  }
}
SxClass.register(ViaNet)
