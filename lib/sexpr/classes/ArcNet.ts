import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export class ArcNet extends SxClass {
  static override token = "net"
  static override parentToken = "arc"
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
  ): ArcNet {
    const [rawId, rawName] = primitiveSexprs
    const id = toNumberValue(rawId)
    if (id === undefined) {
      throw new Error("net expects a numeric identifier")
    }
    const name = rawName === undefined ? undefined : toStringValue(rawName)
    return new ArcNet(id, name ?? undefined)
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
    this._name = value === "" ? undefined : value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const namePart = this._name ? ` ${quoteSExprString(this._name)}` : ""
    return `(net ${this._id}${namePart})`
  }
}
SxClass.register(ArcNet)
