import { SxClass } from "../base-classes/SxClass"
import { printSExpr, type PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export class EmbeddedFonts extends SxClass {
  static override token = "embedded_fonts"
  token = "embedded_fonts"

  private _children: SxClass[] = []
  private _rawItems: EmbeddedFontsRawItem[] = []

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): EmbeddedFonts {
    const embeddedFonts = new EmbeddedFonts()

    for (const primitive of primitiveSexprs) {
      if (Array.isArray(primitive) && primitive.length > 0) {
        try {
          const parsed = SxClass.parsePrimitiveSexpr(primitive, {
            parentToken: this.token,
          })
          if (parsed instanceof SxClass) {
            embeddedFonts._children.push(parsed)
            continue
          }
        } catch (error) {
          // fall through to raw handling
        }
      }

      embeddedFonts._rawItems.push(new EmbeddedFontsRawItem(primitive))
    }

    return embeddedFonts
  }

  get childrenEntries(): SxClass[] {
    return [...this._children]
  }

  set childrenEntries(children: SxClass[]) {
    this._children = [...children]
  }

  get rawItems(): EmbeddedFontsRawItem[] {
    return [...this._rawItems]
  }

  set rawItems(values: EmbeddedFontsRawItem[]) {
    this._rawItems = [...values]
  }

  override getChildren(): SxClass[] {
    return [...this._children, ...this._rawItems]
  }

  override getString(): string {
    if (this._children.length === 0 && this._rawItems.length === 0) {
      return "(embedded_fonts)"
    }

    const lines = ["(embedded_fonts"]
    for (const child of this._children) {
      lines.push(child.getStringIndented())
    }
    for (const raw of this._rawItems) {
      lines.push(raw.getStringIndented())
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(EmbeddedFonts)

class EmbeddedFontsRawItem extends SxClass {
  static override token = "__embedded_fonts_raw__"
  token: string
  private readonly primitive: PrimitiveSExpr

  constructor(primitive: PrimitiveSExpr) {
    super()
    this.primitive = primitive
    this.token = this.resolveToken(primitive)
  }

  private resolveToken(value: PrimitiveSExpr): string {
    if (typeof value === "string") return value
    if (Array.isArray(value) && value.length > 0) {
      const [token] = value
      if (typeof token === "string") return token
    }
    return "__embedded_fonts_raw__"
  }

  get primitiveValue(): PrimitiveSExpr {
    return this.primitive
  }

  override getChildren(): SxClass[] {
    return []
  }

  override getString(): string {
    return printSExpr(this.primitive)
  }
}
