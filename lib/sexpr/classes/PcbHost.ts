import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteIfNeeded } from "../utils/quoteSExprString"
import { toStringValue } from "../utils/toStringValue"

export class PcbHost extends SxClass {
  static override token = "host"
  static override parentToken = "kicad_pcb"
  token = "host"

  private _application: string
  private _version?: string

  constructor(application: string, version?: string) {
    super()
    this._application = application
    this._version = version
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): PcbHost {
    const application = toStringValue(primitiveSexprs[0])
    const version = toStringValue(primitiveSexprs[1])
    if (application === undefined) {
      throw new Error("host requires an application name")
    }
    return new PcbHost(application, version)
  }

  get application(): string {
    return this._application
  }

  set application(value: string) {
    this._application = value
  }

  get version(): string | undefined {
    return this._version
  }

  set version(value: string | undefined) {
    this._version = value
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const values = [quoteIfNeeded(this._application)]
    if (this._version !== undefined) {
      values.push(quoteIfNeeded(this._version))
    }
    return `(host ${values.join(" ")})`
  }
}
SxClass.register(PcbHost)
