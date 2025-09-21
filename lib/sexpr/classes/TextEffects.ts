import { SxClass } from "../base-classes/SxClass"
import { quoteSExprString } from "../utils/quoteSExprString"

export type TextEffectsProperty =
  | TextEffectsFont
  | TextEffectsJustify

export class TextEffects extends SxClass {
  static override token = "effects"
  token = "effects"

  override _propertyMap: {
    font?: TextEffectsFont
    justify?: TextEffectsJustify
  } = {}

  hidden = false

  constructor(args: Array<TextEffectsProperty | string>) {
    super()

    const structuredArgs: TextEffectsProperty[] = []
    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg === "hide") {
          this.hidden = true
        }
        continue
      }
      if (arg instanceof TextEffectsFont) {
        structuredArgs.push(arg)
        continue
      }
      if (arg instanceof TextEffectsJustify) {
        structuredArgs.push(arg)
        continue
      }
    }

    if (structuredArgs.length > 0) {
      this.loadProperties(structuredArgs)
    }
  }

  get font(): TextEffectsFont {
    if (!this._propertyMap.font) {
      this._propertyMap.font = new TextEffectsFont([])
    }
    return this._propertyMap.font
  }

  set font(font: TextEffectsFont) {
    this._propertyMap.font = font
  }

  get justify(): TextEffectsJustify | undefined {
    return this._propertyMap.justify
  }

  set justify(justify: TextEffectsJustify | undefined) {
    if (!justify) {
      delete this._propertyMap.justify
      return
    }
    this._propertyMap.justify = justify
  }

  get hiddenText(): boolean {
    return this.hidden
  }

  set hiddenText(hidden: boolean) {
    this.hidden = hidden
  }

  override getString(): string {
    const lines = ["(effects"]

    if (this._propertyMap.font) {
      const fontLines = this._propertyMap.font.getString().split("\n")
      for (const fontLine of fontLines) {
        lines.push(`  ${fontLine}`)
      }
    }

    if (this._propertyMap.justify) {
      lines.push(`  ${this._propertyMap.justify.getString()}`)
    }

    if (this.hidden) {
      lines.push("  hide")
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

  override _propertyMap: {
    face?: TextEffectsFontFace
    size?: TextEffectsFontSize
    thickness?: TextEffectsFontThickness
    line_spacing?: TextEffectsFontLineSpacing
  } = {}

  bold = false
  italic = false

  constructor(args: Array<TextEffectsFontProperty | string>) {
    super()

    const structuredArgs: TextEffectsFontProperty[] = []
    for (const arg of args) {
      if (typeof arg === "string") {
        if (arg === "bold") {
          this.bold = true
          continue
        }
        if (arg === "italic") {
          this.italic = true
          continue
        }
        continue
      }
      structuredArgs.push(arg)
    }

    if (structuredArgs.length > 0) {
      this.loadProperties(structuredArgs)
    }
  }

  get face(): string | undefined {
    return this._propertyMap.face?.value
  }

  set face(value: string | undefined) {
    if (value === undefined) {
      delete this._propertyMap.face
      return
    }
    this._propertyMap.face = new TextEffectsFontFace([value])
  }

  get size(): { height: number; width: number } | undefined {
    const size = this._propertyMap.size
    if (!size) return undefined
    return { height: size.height, width: size.width }
  }

  set size(size: { height: number; width: number } | undefined) {
    if (!size) {
      delete this._propertyMap.size
      return
    }
    this._propertyMap.size = new TextEffectsFontSize([size.height, size.width])
  }

  get thickness(): number | undefined {
    return this._propertyMap.thickness?.value
  }

  set thickness(value: number | undefined) {
    if (value === undefined) {
      delete this._propertyMap.thickness
      return
    }
    this._propertyMap.thickness = new TextEffectsFontThickness([value])
  }

  get lineSpacing(): number | undefined {
    return this._propertyMap.line_spacing?.value
  }

  set lineSpacing(value: number | undefined) {
    if (value === undefined) {
      delete this._propertyMap.line_spacing
      return
    }
    this._propertyMap.line_spacing = new TextEffectsFontLineSpacing([value])
  }

  override getString(): string {
    const lines = ["(font"]

    if (this._propertyMap.face) {
      lines.push(`  ${this._propertyMap.face.getString()}`)
    }

    if (this._propertyMap.size) {
      lines.push(`  ${this._propertyMap.size.getString()}`)
    }

    if (this._propertyMap.thickness) {
      lines.push(`  ${this._propertyMap.thickness.getString()}`)
    }

    if (this.bold) {
      lines.push("  bold")
    }

    if (this.italic) {
      lines.push("  italic")
    }

    if (this._propertyMap.line_spacing) {
      lines.push(`  ${this._propertyMap.line_spacing.getString()}`)
    }

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(TextEffectsFont)

export class TextEffectsFontFace extends SxClass {
  static override token = "face"
  static override parentToken = "font"
  token = "face"

  value: string

  constructor(args: [value: string]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(face ${quoteSExprString(this.value)})`
  }
}
SxClass.register(TextEffectsFontFace)

export class TextEffectsFontSize extends SxClass {
  static override token = "size"
  static override parentToken = "font"
  token = "size"

  height: number
  width: number

  constructor(args: [height: number, width: number]) {
    super()
    this.height = args[0]
    this.width = args[1]
  }

  override getString(): string {
    return `(size ${this.height} ${this.width})`
  }
}
SxClass.register(TextEffectsFontSize)

export class TextEffectsFontThickness extends SxClass {
  static override token = "thickness"
  static override parentToken = "font"
  token = "thickness"

  value: number

  constructor(args: [value: number]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(thickness ${this.value})`
  }
}
SxClass.register(TextEffectsFontThickness)

export class TextEffectsFontLineSpacing extends SxClass {
  static override token = "line_spacing"
  static override parentToken = "font"
  token = "line_spacing"

  value: number

  constructor(args: [value: number]) {
    super()
    this.value = args[0]
  }

  override getString(): string {
    return `(line_spacing ${this.value})`
  }
}
SxClass.register(TextEffectsFontLineSpacing)

export class TextEffectsJustify extends SxClass {
  static override token = "justify"
  static override parentToken = "effects"
  static override rawArgs = true
  token = "justify"

  horizontal?: "left" | "right"
  vertical?: "top" | "bottom"
  mirror = false
  extraTokens: string[] = []

  constructor(args: Array<string>) {
    super()
    for (const arg of args) {
      switch (arg) {
        case "left":
          this.horizontal = "left"
          break
        case "right":
          this.horizontal = "right"
          break
        case "top":
          this.vertical = "top"
          break
        case "bottom":
          this.vertical = "bottom"
          break
        case "mirror":
          this.mirror = true
          break
        default:
          this.extraTokens.push(arg)
          break
      }
    }
  }

  getStringTokens(): string[] {
    const tokens = ["justify"]
    if (this.horizontal) tokens.push(this.horizontal)
    if (this.vertical) tokens.push(this.vertical)
    if (this.mirror) tokens.push("mirror")
    tokens.push(...this.extraTokens)
    return tokens
  }

  override getString(): string {
    return `(${this.getStringTokens().join(" ")})`
  }
}
SxClass.register(TextEffectsJustify)
