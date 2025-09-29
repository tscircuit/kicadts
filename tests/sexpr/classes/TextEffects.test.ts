import { SxClass, TextEffects, TextEffectsJustify } from "lib/sexpr"
import { expect, test } from "bun:test"

test("TextEffects", () => {
  const [effects] = SxClass.parse(`
    (effects
      (font
        (face "KiCad Font")
        (size 1.5 1.2)
        (thickness 0.3)
        bold
        italic
        (line_spacing 1.1)
      )
      (justify left top mirror)
      hide
    )
  `)

  expect(effects).toBeInstanceOf(TextEffects)

  const textEffects = effects as TextEffects
  expect(textEffects.font.face).toBe("KiCad Font")
  expect(textEffects.font.size).toEqual({ height: 1.5, width: 1.2 })
  expect(textEffects.font.thickness).toBe(0.3)
  expect(textEffects.font.bold).toBe(true)
  expect(textEffects.font.italic).toBe(true)
  expect(textEffects.font.lineSpacing).toBe(1.1)

  const justify = textEffects.justify as TextEffectsJustify
  expect(justify.horizontal).toBe("left")
  expect(justify.vertical).toBe("top")
  expect(justify.mirror).toBe(true)

  expect(textEffects.hiddenText).toBe(true)

  textEffects.hiddenText = false
  textEffects.justify = new TextEffectsJustify({
    horizontal: "right",
    vertical: "bottom",
  })

  expect(textEffects.getString()).toMatchInlineSnapshot(`
    "(effects
      (font
        (face \"KiCad Font\")
        (size 1.5 1.2)
        (thickness 0.3)
        bold
        italic
        (line_spacing 1.1)
      )
      (justify right bottom)
    )"
  `)
})
