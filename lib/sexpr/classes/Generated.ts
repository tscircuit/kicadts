import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"

const GENERATED_STRING_TOKENS = new Set([
  "initial_side",
  "last_netname",
  "last_status",
  "last_tuning",
  "layer",
  "members",
  "name",
  "tuning_mode",
  "uuid",
])

function printGeneratedSExpr(value: PrimitiveSExpr): string {
  if (
    Array.isArray(value) &&
    typeof value[0] === "string" &&
    GENERATED_STRING_TOKENS.has(value[0])
  ) {
    return `(${value
      .map((child, index) =>
        index > 0 && typeof child === "string"
          ? quoteSExprString(child)
          : printGeneratedSExpr(child),
      )
      .join(" ")})`
  }

  if (Array.isArray(value)) {
    return `(${value.map(printGeneratedSExpr).join(" ")})`
  }

  return printSExpr(value)
}

export class Generated extends SxClass {
  static override token = "generated"
  static override parentToken = "kicad_pcb"
  token = "generated"

  private _rawChildren: PrimitiveSExpr[] = []

  constructor() {
    super()
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Generated {
    const generated = new Generated()
    generated.rawChildren = primitiveSexprs
    return generated
  }

  get rawChildren(): PrimitiveSExpr[] {
    return [...this._rawChildren]
  }

  set rawChildren(value: PrimitiveSExpr[]) {
    this._rawChildren = [...value]
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    const lines = ["(generated"]
    for (const child of this._rawChildren) {
      const rendered = printGeneratedSExpr(child)
      lines.push(...rendered.split("\n").map((line) => `  ${line}`))
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Generated)
