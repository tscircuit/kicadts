import { SxClass } from "../../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../../parseToPrimitiveSExpr"
import { quoteSExprString } from "../../utils/quoteSExprString"
import { toNumberValue } from "../../utils/toNumberValue"
import { toStringValue } from "../../utils/toStringValue"

export class PcbNet extends SxClass {
  static override token = "net"
  static override rawArgs = true
  override token = "net"

  private args: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.args = [...args]
  }

  get id(): number | undefined {
    return toNumberValue(this.args[0])
  }

  set id(value: number | undefined) {
    if (value === undefined) {
      if (this.args.length > 0) {
        this.args.shift()
      }
      return
    }
    if (this.args.length === 0) {
      this.args.push(value)
      return
    }
    this.args[0] = value
  }

  get name(): string | undefined {
    if (this.args.length < 2) return undefined
    return toStringValue(this.args[1])
  }

  set name(value: string | undefined) {
    if (value === undefined) {
      if (this.args.length > 1) {
        this.args.splice(1, 1)
      }
      return
    }
    if (this.args.length < 2) {
      while (this.args.length < 1) {
        this.args.push(0)
      }
      this.args.push(value)
      return
    }
    this.args[1] = value
  }

  get extraArgs(): PrimitiveSExpr[] {
    if (this.args.length <= 2) return []
    return this.args.slice(2)
  }

  set extraArgs(values: PrimitiveSExpr[]) {
    const base = this.args.slice(0, 2)
    this.args = [...base, ...values]
  }

  override getString(): string {
    if (this.args.length === 0) {
      return "(net)"
    }

    const rendered = this.args.map((arg, index) => {
      if (index === 1 && typeof arg === "string") {
        return quoteSExprString(arg)
      }
      return printSExpr(arg)
    })

    return `(net ${rendered.join(" ")})`
  }
}
SxClass.register(PcbNet)
