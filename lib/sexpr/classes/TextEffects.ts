import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { toNumberValue } from "../utils/toNumberValue"
import { toStringValue } from "../utils/toStringValue"
import { quoteSExprString } from "../utils/quoteSExprString"
import { SxPrimitiveString } from "../base-classes/SxPrimitiveString"
import { SxPrimitiveNumber } from "../base-classes/SxPrimitiveNumber"

export type TextEffectsProperty = TextEffectsFont | TextEffectsJustify

export class TextEffects extends SxClass {
  static override token = "effects"
  token = "effects"

  _sxFont?: TextEffectsFont
  _sxJustify?: TextEffectsJustify

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffects {
    const effects = new TextEffects()

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    effects._sxFont = propertyMap.font as TextEffectsFont
    effects._sxJustify = propertyMap.justify as TextEffectsJustify

    return effects
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

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsFont {
    const font = new TextEffectsFont()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)

    return font
  }
}
SxClass.register(TextEffectsFont)

export class TextEffectsFontFace extends SxPrimitiveString {
  static override token = "face"
  static override parentToken = "font"
  token = "face"
}
SxClass.register(TextEffectsFontFace)

export class TextEffectsFontSize extends SxClass {
  static override token = "size"
  static override parentToken = "font"
  token = "size"

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsFontSize {
    const size = new TextEffectsFontSize()
    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    return size
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

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): TextEffectsJustify {
    const justify = new TextEffectsJustify()
    // const { propertyMap, arrayPropertyMap } =
    //   SxClass.parsePrimitivesToClassProperties(primitiveSexprs, this.token)
    return justify
  }
}
SxClass.register(TextEffectsJustify)
