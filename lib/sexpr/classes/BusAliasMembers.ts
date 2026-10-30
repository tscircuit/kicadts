import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

export class BusAliasMembers extends SxClass {
  static override token = "members"
  static override parentToken = "bus_alias"
  override token = "members"

  private _members: string[] = []

  constructor(members: string[] = []) {
    super()
    this.members = members
  }

  static override fromSexprPrimitives(
    primitives: PrimitiveSExpr[],
  ): BusAliasMembers {
    const members = primitives.map((primitive) => {
      if (typeof primitive !== "string") {
        throw new Error("bus_alias members expects string names")
      }
      return primitive
    })
    return new BusAliasMembers(members)
  }

  get members(): string[] {
    return [...this._members]
  }

  set members(value: string[]) {
    this._members = [...value]
  }

  override getString(): string {
    const members = this._members.map(quoteSExprString).join(" ")
    return members ? `(members ${members})` : "(members)"
  }
}
SxClass.register(BusAliasMembers)
