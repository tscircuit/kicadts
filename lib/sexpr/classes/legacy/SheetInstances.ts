import { SxClass } from "../../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toStringValue } from "../utils/toStringValue"
import { toNumberValue } from "../utils/toNumberValue"
import { parseYesNo } from "../utils/parseYesNo"
import { indentLines } from "../utils/indentLines"
import { strokeFromArgs } from "../utils/strokeFromArgs"
import { At } from "./At"
import { Uuid } from "./Uuid"
import { Stroke } from "./Stroke"
import { TextEffects } from "./TextEffects"

export class SheetInstances extends SxClass {
  static override token = "instances"
  static override parentToken = "sheet"
  static override rawArgs = true
  token = "instances"

  raw: PrimitiveSExpr[]

  constructor(args: PrimitiveSExpr[]) {
    super()
    this.raw = args
  }

  getStringLines(): string[] {
    const lines = ["(instances"]
    for (const entry of this.raw) {
      lines.push(...indentLines(printSExpr(entry)))
    }
    lines.push(")")
    return lines
  }
}
SxClass.register(SheetInstances)
