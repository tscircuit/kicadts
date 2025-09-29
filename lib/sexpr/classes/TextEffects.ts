import { SxClass } from "../base-classes/SxClass"
import { SxPrimitiveBoolean } from "../base-classes/SxPrimitiveBoolean"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
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

    effects._sxFont = propertyMap.font as TextEffectsFont | undefined
    effects._sxJustify = propertyMap.justify as TextEffectsJustify | undefined
    const hideNode = propertyMap.hide as TextEffectsHide | undefined
    if (hideNode) {
      effects._hiddenText = hideNode.value
    }

    for (const primitive of primitiveSexprs) {
      if (typeof primitive === "string") {
        if (primitive === "hide") {
          effects._hiddenText = true
          continue
        }
        throw new Error(`Unknown text effects token: ${primitive}`)
      }

      if (Array.isArray(primitive)) {
        // Arrays are parsed via parsePrimitivesToClassProperties already.
        continue
      }

      throw new Error(
        `Unsupported text effects primitive: ${JSON.stringify(primitive)}`,
      )
    }

    return effects
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxFont) children.push(this._sxFont)
    if (this._sxJustify) children.push(this._sxJustify)
    if (this._hiddenText) children.push(new TextEffectsHide(true))
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
      lines.push(new TextEffectsHide(true).getStringIndented())
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
  private _bold = false
  private _italic = false

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

  set size(value:
    | TextEffectsFontSize
    | { height: number; width: number }
    | undefined,) {
    if (value === undefined) {
      this._sxSize = undefined
      return
    }

    if (value instanceof TextEffectsFontSize) {
      this._sxSize = value
      return
    }

    this._sxSize = new TextEffectsFontSize(value.height, value.width)
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

  get bold(): boolean {
    return this._bold
  }

  set bold(value: boolean) {
    this._bold = value
  }

  get italic(): boolean {
    return this._italic
  }

  set italic(value: boolean) {
    this._italic = value
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
          font._bold = true
          continue
        }
        if (primitive === "italic") {
          font._italic = true
          continue
        }
        throw new Error(`Unknown font token: ${primitive}`)
      }

      if (Array.isArray(primitive)) {
        continue
      }

      throw new Error(
        `Unsupported font primitive: ${JSON.stringify(primitive)}`,
      )
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
    if (this._bold) {
      lines.push("  bold")
    }
    if (this._italic) {
      lines.push("  italic")
    }
    if (this._sxLineSpacing) {
      lines.push(this._sxLineSpacing.getStringIndented())
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

  private _height = 0
  private _width = 0

  constructor(height = 0, width = 0) {
    super()
    this._height = height
    this._width = width
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsFontSize {
    const height = toNumberValue(primitiveSexprs[0]) ?? 0
    const width = toNumberValue(primitiveSexprs[1]) ?? 0
    return new TextEffectsFontSize(height, width)
  }

  get height(): number {
    return this._height
  }

  set height(value: number) {
    this._height = value
  }

  get width(): number {
    return this._width
  }

  set width(value: number) {
    this._width = value
  }

  override getString(): string {
    return `(size ${this._height} ${this._width})`
  }
}
SxClass.register(TextEffectsFontSize)

export class TextEffectsFontThickness extends SxPrimitiveNumber {
  static override token = "thickness"
  static override parentToken = "font"
  token = "thickness"
}
SxClass.register(TextEffectsFontThickness)

class TextEffectsHide extends SxPrimitiveBoolean {
  static override token = "hide"
  static override parentToken = "effects"
  token = "hide"

  constructor(value?: boolean) {
    super(value ?? true)
  }

  override getString(): string {
    return this.value ? "(hide yes)" : "(hide no)"
  }
}
SxClass.register(TextEffectsHide)

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

  private _horizontal?: "left" | "right"
  private _vertical?: "top" | "bottom"
  private _mirror = false

  constructor(
    options: {
      horizontal?: "left" | "right"
      vertical?: "top" | "bottom"
      mirror?: boolean
    } = {},
  ) {
    super()
    this._horizontal = options.horizontal
    this._vertical = options.vertical
    this._mirror = options.mirror ?? false
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsJustify {
    const justify = new TextEffectsJustify()

    for (const primitive of primitiveSexprs) {
      const value = toStringValue(primitive)
      if (value === undefined) {
        throw new Error(
          `Unsupported justify primitive: ${JSON.stringify(primitive)}`,
        )
      }

      if (value === "left" || value === "right") {
        justify._horizontal = value
        continue
      }

      if (value === "top" || value === "bottom") {
        justify._vertical = value
        continue
      }

      if (value === "mirror") {
        justify._mirror = true
        continue
      }

      throw new Error(`Unknown justify token: ${value}`)
    }

    return justify
  }

  get horizontal(): "left" | "right" | undefined {
    return this._horizontal
  }

  set horizontal(value: "left" | "right" | undefined) {
    this._horizontal = value
  }

  get vertical(): "top" | "bottom" | undefined {
    return this._vertical
  }

  set vertical(value: "top" | "bottom" | undefined) {
    this._vertical = value
  }

  get mirror(): boolean {
    return this._mirror
  }

  set mirror(value: boolean) {
    this._mirror = value
  }

  override getString(): string {
    const parts = ["(justify"]
    if (this._horizontal) {
      parts.push(` ${this._horizontal}`)
    }
    if (this._vertical) {
      parts.push(` ${this._vertical}`)
    }
    if (this._mirror) {
      parts.push(" mirror")
    }
    parts.push(")")
    return parts.join("")
  }
}
SxClass.register(TextEffectsJustify)
