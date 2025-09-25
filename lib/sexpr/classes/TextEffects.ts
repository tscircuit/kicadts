import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { printSExpr } from "../parseToPrimitiveSExpr"
import { quoteSExprString } from "../utils/quoteSExprString"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"

export type TextEffectsProperty = TextEffectsFont | TextEffectsJustify

export class TextEffects extends SxClass {
  static override token = "effects"
  token = "effects"

  _sxFont?: TextEffectsFont
  _sxJustify?: TextEffectsJustify
  private _hiddenText = false
  extras: PrimitiveSExpr[] = []

  get font(): TextEffectsFont {
    if (!this._sxFont) {
      this._sxFont = new TextEffectsFont()
    }
    return this._sxFont
  }

  set font(value: TextEffectsFont | undefined) {
    this._sxFont = value
  }

  get justify(): TextEffectsJustify | undefined {
    return this._sxJustify
  }

  set justify(value: TextEffectsJustify | undefined) {
    this._sxJustify = value
  }

  get hiddenText(): boolean {
    return this._hiddenText
  }

  set hiddenText(value: boolean) {
    this._hiddenText = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffects {
    const effects = new TextEffects()

    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    effects._sxFont = propertyMap.font as TextEffectsFont
    effects._sxJustify = propertyMap.justify as TextEffectsJustify

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "hide") {
          effects._hiddenText = true
          continue
        }
        effects.extras.push(primitive)
        continue
      }
      if (Array.isArray(primitive)) {
        const [token] = primitive
        if (token === "font" || token === "justify") {
          continue
        }
        effects.extras.push(primitive)
        continue
      }
      effects.extras.push(primitive)
    }

    return effects
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFont) children.push(this._sxFont)
    if (this._sxJustify) children.push(this._sxJustify)
    return children
  }

  override getString(): string {
    const lines = ["(effects"]
    if (this._sxFont) {
      lines.push(this._sxFont.getStringIndented())
    }
    if (this._sxJustify) {
      lines.push(this._sxJustify.getStringIndented())
    }
    if (this._hiddenText) {
      lines.push("  hide")
    }
    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TextEffects)

export type TextEffectsFontProperty =
  | TextEffectsFontFace
  | TextEffectsFontSize
  | TextEffectsFontThickness
  | TextEffectsFontLineSpacing

export class TextEffectsFont extends SxClass {
  static override token = "font"
  static override parentToken = "effects"
  token = "font"

  _sxFace?: TextEffectsFontFace
  _sxSize?: TextEffectsFontSize
  _sxThickness?: TextEffectsFontThickness
  _sxLineSpacing?: TextEffectsFontLineSpacing
  bold = false
  italic = false
  extras: PrimitiveSExpr[] = []

  get face(): string | undefined {
    return this._sxFace?.value
  }

  set face(value: string | undefined) {
    this._sxFace =
      value === undefined ? undefined : new TextEffectsFontFace(value)
  }

  get size(): { height: number; width: number } | undefined {
    if (!this._sxSize) return undefined
    return { height: this._sxSize.height, width: this._sxSize.width }
  }

  set size(value: { height: number; width: number } | undefined) {
    this._sxSize =
      value === undefined
        ? undefined
        : new TextEffectsFontSize([value.height, value.width])
  }

  get thickness(): number | undefined {
    return this._sxThickness?.value
  }

  set thickness(value: number | undefined) {
    this._sxThickness =
      value === undefined ? undefined : new TextEffectsFontThickness(value)
  }

  get lineSpacing(): number | undefined {
    return this._sxLineSpacing?.value
  }

  set lineSpacing(value: number | undefined) {
    this._sxLineSpacing =
      value === undefined ? undefined : new TextEffectsFontLineSpacing(value)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsFont {
    const font = new TextEffectsFont()
    const { propertyMap } = SxClass.parsePrimitivesToClassProperties(
      primitiveSexprs,
      this.token,
    )

    font._sxFace = propertyMap.face as TextEffectsFontFace
    font._sxSize = propertyMap.size as TextEffectsFontSize
    font._sxThickness = propertyMap.thickness as TextEffectsFontThickness
    font._sxLineSpacing = propertyMap.line_spacing as TextEffectsFontLineSpacing

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "bold") {
          font.bold = true
          continue
        }
        if (primitive === "italic") {
          font.italic = true
          continue
        }
        font.extras.push(primitive)
        continue
      }

      if (Array.isArray(primitive)) {
        const [token] = primitive
        if (
          token === "face" ||
          token === "size" ||
          token === "thickness" ||
          token === "line_spacing"
        ) {
          continue
        }
        font.extras.push(primitive)
        continue
      }

      font.extras.push(primitive)
    }

    return font
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFace) children.push(this._sxFace)
    if (this._sxSize) children.push(this._sxSize)
    if (this._sxThickness) children.push(this._sxThickness)
    if (this._sxLineSpacing) children.push(this._sxLineSpacing)
    return children
  }

  override getString(): string {
    const lines = ["(font"]
    if (this._sxFace) {
      lines.push(this._sxFace.getStringIndented())
    }
    if (this._sxSize) {
      lines.push(this._sxSize.getStringIndented())
    }
    if (this._sxThickness) {
      lines.push(this._sxThickness.getStringIndented())
    }
    if (this.bold) {
      lines.push("  bold")
    }
    if (this.italic) {
      lines.push("  italic")
    }
    if (this._sxLineSpacing) {
      lines.push(this._sxLineSpacing.getStringIndented())
    }
    for (const extra of this.extras) {
      lines.push(`  ${printSExpr(extra)}`)
    }
    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TextEffectsFont)

export class TextEffectsFontFace extends SxPrimitiveString {
  static override token = "face"
  static override parentToken = "font"
  token = "face"

  override getString(): string {
    return `(face ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TextEffectsFontFace)

export class TextEffectsFontSize extends SxClass {
  static override token = "size"
  static override parentToken = "font"
  token = "size"

  height = 0
  width = 0

  constructor(args: [height: number, width: number]) {
    super()
    this.height = args[0]
    this.width = args[1]
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsFontSize {
    const height = toNumberValue(primitiveSexprs[0]) ?? 0
    const width = toNumberValue(primitiveSexprs[1]) ?? 0
    return new TextEffectsFontSize([height, width])
  }

  override getString(): string {
    return `(size ${this.height} ${this.width})`
  }
}
SxClass.register(TextEffectsFontSize)

export class TextEffectsFontThickness extends SxPrimitiveNumber {
  static override token = "thickness"
  static override parentToken = "font"
  token = "thickness"
}
SxClass.register(TextEffectsFontThickness)

export class TextEffectsFontLineSpacing extends SxPrimitiveNumber {
  static override token = "line_spacing"
  static override parentToken = "font"
  token = "line_spacing"
}
SxClass.register(TextEffectsFontLineSpacing)

export class TextEffectsJustify extends SxClass {
  static override token = "justify"
  static override parentToken = "effects"
  token = "justify"

  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
  mirror = false
  extras: PrimitiveSExpr[] = []

  constructor(args: PrimitiveSExpr[] = []) {
    super()
    this.applyArgs(args)
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsJustify {
    return new TextEffectsJustify(primitiveSexprs)
  }

  private applyArgs(primitiveSexprs: PrimitiveSExpr[]) {
    for (const primitive of primitiveSexprs) {
      const value = toStringValue(primitive)
      if (!value) {
        this.extras.push(primitive)
        continue
      }

      if (value === "left" || value === "right") {
        this.horizontal = value
        continue
      }

      if (value === "top" || value === "bottom") {
        this.vertical = value
        continue
      }

      if (value === "mirror") {
        this.mirror = true
        continue
      }

      this.extras.push(primitive)
    }
  }

  override getString(): string {
    const parts = ["(justify"]
    if (this.horizontal) {
      parts.push(` ${this.horizontal}`)
    }
    if (this.vertical) {
      parts.push(` ${this.vertical}`)
    }
    if (this.mirror) {
      parts.push(" mirror")
    }
    for (const extra of this.extras) {
      parts.push(` ${toStringValue(extra) ?? printSExpr(extra)}`)
    }
    parts.push(")")
    return parts.join("")
  }
}
SxClass.register(TextEffectsJustify)
