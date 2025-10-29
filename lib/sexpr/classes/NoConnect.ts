import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { At, type AtInput } from "./At"
import { Uuid } from "./Uuid"

const SUPPORTED_TOKENS = new Set(["at", "uuid"])

export interface NoConnectConstructorParams {
  at?: AtInput
  uuid?: string | Uuid
}

export class NoConnect extends SxClass {
  static override token = "no_connect"
  static override parentToken = "kicad_sch"
  override token = "no_connect"

  private _sxAt?: At
  private _sxUuid?: Uuid

  constructor(params: NoConnectConstructorParams = {}) {
    super()

    if (params.at !== undefined) {
      this.at = params.at
    }

    if (params.uuid !== undefined) {
      this.uuid = params.uuid
    }
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): NoConnect {
    const noConnect = new NoConnect()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_TOKENS.has(token)) {
        continue
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `no_connect does not support repeated child tokens: ${token}`,
        )
      }
    }

    const unsupportedTokens = Object.keys(propertyMap).filter(
      (token) => !SUPPORTED_TOKENS.has(token),
    )
    if (unsupportedTokens.length > 0) {
      throw new Error(
        `Unsupported child tokens inside no_connect expression: ${unsupportedTokens.join(", ")}`,
      )
    }

    noConnect._sxAt = propertyMap.at as At | undefined
    noConnect._sxUuid = propertyMap.uuid as Uuid | undefined

    return noConnect
  }

  get at(): At | undefined {
    return this._sxAt
  }

  set at(value: AtInput | undefined) {
    this._sxAt = value !== undefined ? At.from(value) : undefined
  }

  get uuid(): Uuid | undefined {
    return this._sxUuid
  }

  set uuid(value: Uuid | string | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxAt) children.push(this._sxAt)
    if (this._sxUuid) children.push(this._sxUuid)
    return children
  }
}
SxClass.register(NoConnect)
