import { SxClass, SchematicText, TextEffects, KicadSch } from "lib/sexpr"
import { expect, test } from "bun:test"

test("TextEffects", () => {
  const [parsed] = SxClass.parse(`
	(kicad_sch
		(text "VPP (13V) power"
			(exclude_from_sim no)
			(at 205.74 119.38 0)
			(effects
				(font
					(size 2.54 2.54)
					(thickness 0.508)
					(bold yes)
					(italic yes)
				)
				(justify left bottom)
			)
			(uuid "6309b1ea-35ff-4629-8b7d-248af0b86a3c")
		)
	)
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const kicadSch = parsed as KicadSch
  expect(kicadSch.texts).toHaveLength(1)

  const text = kicadSch.texts[0]
  expect(text).toBeInstanceOf(SchematicText)
  const txt = text as SchematicText

  const effects = txt.effects as TextEffects
  expect(effects.font.size).toEqual({ height: 2.54, width: 2.54 })
  expect(effects.font.thickness).toBe(0.508)
  expect(effects.font.bold).toBe(true)
  expect(effects.font.italic).toBe(true)
  expect(effects.justify.horizontal).toBe("left")
  expect(effects.justify.vertical).toBe("bottom")

  expect(txt.getString()).toMatchInlineSnapshot(`
    "(text "VPP (13V) power"
      (exclude_from_sim no)
      (at 205.74 119.38 0)
      (effects
        (font
          (size 2.54 2.54)
          (thickness 0.508)
          bold
          italic
        )
        (justify left bottom)
      )
      (uuid 6309b1ea-35ff-4629-8b7d-248af0b86a3c)
    )"
  `)
})
