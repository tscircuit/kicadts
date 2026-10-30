import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { BusAliasMembers } from "./BusAliasMembers"

export interface BusAliasConstructorParams {
  name: string
  members?: string[] | BusAliasMembers
}

export class BusAlias extends SxClass {
  static override token = "bus_alias"
  static override parentToken = "kicad_sch"
  override token = "bus_alias"

  name: string
  private _sxMembers: BusAliasMembers

  constructor(params: BusAliasConstructorParams) {
    super()
    this.name = params.name
    this._sxMembers =
      params.members instanceof BusAliasMembers
        ? params.members
        : new BusAliasMembers(params.members ?? [])
  }

  static override fromSexprPrimitives(primitives: PrimitiveSExpr[]): BusAlias {
    const [name, ...children] = primitives
    if (typeof name !== "string") {
      throw new Error("bus_alias expects a string name")
    }
    for (const child of children) {
      if (!Array.isArray(child) || typeof child[0] !== "string") {
        throw new Error("bus_alias requires child expressions")
      }
    }
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(children, this.token)
    for (const [token, entries] of Object.entries(arrayPropertyMap)) {
      if (token !== "members") {
        throw new Error(
          `bus_alias encountered unsupported child token "${token}"`,
        )
      }
      if (entries.length > 1) {
        throw new Error(
          `bus_alias does not support repeated child token "${token}"`,
        )
      }
    }
    if (!(propertyMap.members instanceof BusAliasMembers)) {
      throw new Error("bus_alias requires a members child")
    }
    return new BusAlias({ name, members: propertyMap.members })
  }

  get members(): string[] {
    return this._sxMembers.members
  }

  set members(value: string[] | BusAliasMembers) {
    this._sxMembers =
      value instanceof BusAliasMembers ? value : new BusAliasMembers(value)
  }

  override getChildren(): SxClass[] {
    return [this._sxMembers]
  }

  override getString(): string {
    return [
      `(bus_alias ${quoteSExprString(this.name)}`,
      this._sxMembers.getStringIndented(),
      ")",
    ].join("\n")
  }
}
SxClass.register(BusAlias)
