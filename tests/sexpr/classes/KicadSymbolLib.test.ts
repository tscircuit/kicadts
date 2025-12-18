import { KicadSymbolLib, SchematicSymbol, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("KicadSymbolLib parse with symbols", () => {
  const [parsed] = SxClass.parse(`
    (kicad_symbol_lib
      (version 20211014)
      (generator kicad_symbol_editor)
      (symbol "R"
        (pin_numbers
          (hide yes)
        )
        (pin_names
          (offset 0)
        )
        (exclude_from_sim no)
        (in_bom yes)
        (on_board yes)
        (property "Reference" "R"
          (id 0)
          (at 2.032 0 90)
        )
        (property "Value" "R"
          (id 1)
          (at 0 0 90)
        )
      )
      (symbol "C"
        (in_bom yes)
        (on_board yes)
        (property "Reference" "C"
          (id 0)
          (at 0 0 0)
        )
      )
    )
  `)

  expect(parsed).toBeInstanceOf(KicadSymbolLib)
  const lib = parsed as KicadSymbolLib

  expect(lib.version).toBe(20211014)
  expect(lib.generator).toBe("kicad_symbol_editor")
  expect(lib.symbols).toHaveLength(2)

  const [resistor, capacitor] = lib.symbols
  expect(resistor).toBeInstanceOf(SchematicSymbol)
  expect(resistor?.libraryId).toBe("R")
  expect(resistor?.inBom).toBe(true)

  expect(capacitor).toBeInstanceOf(SchematicSymbol)
  expect(capacitor?.libraryId).toBe("C")
})

test("KicadSymbolLib construct and getString", () => {
  const lib = new KicadSymbolLib({
    version: 20211014,
    generator: "circuit-json-to-kicad",
    symbols: [
      new SchematicSymbol({
        libraryId: "TestSymbol",
        inBom: true,
        onBoard: true,
      }),
    ],
  })

  expect(lib.version).toBe(20211014)
  expect(lib.generator).toBe("circuit-json-to-kicad")
  expect(lib.symbols).toHaveLength(1)

  const output = lib.getString()
  expect(output).toContain("(kicad_symbol_lib")
  expect(output).toContain("(version 20211014)")
  expect(output).toContain("(generator circuit-json-to-kicad)")
  expect(output).toContain('(symbol "TestSymbol"')
})

test("KicadSymbolLib round-trip parse", () => {
  const input = `(kicad_symbol_lib
  (version 20211014)
  (generator kicad_symbol_editor)
  (symbol "Device:R"
    (in_bom yes)
    (on_board yes)
    (property "Reference" "R"
      (id 0)
      (at 2.032 0 90)
    )
  )
)`

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(KicadSymbolLib)

  const lib = parsed as KicadSymbolLib
  const output = lib.getString()

  // Parse the output again to ensure it's valid
  const [reparsed] = SxClass.parse(output)
  expect(reparsed).toBeInstanceOf(KicadSymbolLib)

  const relib = reparsed as KicadSymbolLib
  expect(relib.version).toBe(lib.version)
  expect(relib.generator).toBe(lib.generator)
  expect(relib.symbols).toHaveLength(lib.symbols.length)
})
