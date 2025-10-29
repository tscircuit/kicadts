import {
  At,
  SxClass,
  SchematicSymbol,
  SymbolProperty,
  SymbolPin,
  TextEffects,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("Symbol parse", () => {
  const [symbol] = SxClass.parse(`
    (symbol "Device:R"
      (at 10 20 90)
      (unit 2)
      
      (in_bom yes)
      (on_board no)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (property "Reference" "R?"
        (id 0)
        (at 0 0 0)
        (effects (font (size 1.27 1.27) (thickness 0.1524)))
      )
      (pin input line (at 0 -5.08 90) (length 2.54)
        (name "A" (effects (font (size 1.27 1.27))))
        (number "1" (effects (font (size 1.27 1.27))))
      )
      (instances (project "Project" (path "/0001" (reference "R1") (unit 1))))
    )
  `)

  expect(symbol).toBeInstanceOf(SchematicSymbol)
  const sym = symbol as SchematicSymbol
  expect(sym.libraryId).toBe("Device:R")
  expect(sym.inBom).toBe(true)
  expect(sym.onBoard).toBe(false)
  expect(sym.uuid).toBe("12345678-1234-1234-1234-123456789abc")
  expect(sym.properties).toHaveLength(1)
  const property = sym.properties[0] as SymbolProperty
  expect(property.key).toBe("Reference")
  expect(property.value).toBe("R?")
  expect(property.id).toBe(0)
  expect(sym.pins).toHaveLength(1)
  const pin = sym.pins[0] as SymbolPin
  expect(pin.name).toBe("A")
  expect(pin.numberString).toBe("1")
  expect(sym.instances).toBeDefined()

  expect(sym.getString()).toMatchInlineSnapshot(`
    "(symbol "Device:R"
      (at 10 20 90)
      (unit 2)
      (in_bom yes)
      (on_board no)
      (uuid 12345678-1234-1234-1234-123456789abc)
      (property "Reference" "R?"
        (id 0)
        (at 0 0 0)
        (effects
          (font
            (size 1.27 1.27)
            (thickness 0.1524)
          )
        )
      )
      (pin input line
        (at 0 -5.08 90)
        (length 2.54)
        (name "A"
          (effects
            (font
              (size 1.27 1.27)
            )
          )
        )
        (number "1"
          (effects
            (font
              (size 1.27 1.27)
            )
          )
        )
      )
      (instances
        (project "Project"
          (path "/0001"
            (reference "R1")
            (unit 1)
          )
        )
      )
    )"
  `)
})

test("Symbol parse 2", () => {
  const [symbol] = SxClass.parse(`
  	(symbol
      (lib_id "pic_programmer:74LS125")
      (at 110.49 106.68 0)
      (mirror y)
      (unit 4)
      (exclude_from_sim no)
      (in_bom yes)
      (on_board yes)
      (dnp no)
      (uuid "00000000-0000-0000-0000-0000442a4d6b")
      (property "Reference" "U2"
        (at 110.49 104.14 0)
        (effects
          (font
            (size 1.27 1.27)
          )
          (justify left bottom)
        )
      )
      (property "Value" "74HC125"
        (at 105.41 110.49 0)
        (effects
          (font
            (size 1.016 1.016)
          )
          (justify left top)
        )
      )
	  )
  `)

  expect(symbol).toBeInstanceOf(SchematicSymbol)
  const sym = symbol as SchematicSymbol
  expect(sym.libraryId).toBe("pic_programmer:74LS125")
  expect(sym.inBom).toBe(true)
  expect(sym.onBoard).toBe(true)
  expect(sym.uuid).toBe("00000000-0000-0000-0000-0000442a4d6b")
  expect(sym.properties).toHaveLength(2)
  expect(sym.mirror).toBe("y")

  expect(sym.getString()).toMatchInlineSnapshot(`
    "(symbol
      (lib_id "pic_programmer:74LS125")
      (at 110.49 106.68 0)
      (mirror y)
      (unit 4)
      (exclude_from_sim no)
      (in_bom yes)
      (on_board yes)
      (dnp no)
      (uuid 00000000-0000-0000-0000-0000442a4d6b)
      (property "Reference" "U2"
        (at 110.49 104.14 0)
        (effects
          (font
            (size 1.27 1.27)
          )
          (justify left bottom)
        )
      )
      (property "Value" "74HC125"
        (at 105.41 110.49 0)
        (effects
          (font
            (size 1.016 1.016)
          )
          (justify left top)
        )
      )
    )"
  `)
})
