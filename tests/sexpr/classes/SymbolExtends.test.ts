import { expect, test } from "bun:test"
import {
  KicadSymbolLib,
  parseKicadSym,
  SchematicSymbol,
  SymbolExtends,
} from "lib/sexpr"

test("derived symbols expose their parent through extends", () => {
  const library = parseKicadSym(`
    (kicad_symbol_lib
      (symbol "74LS245" (in_bom yes) (on_board yes))
      (symbol "74HC245" (extends "74LS245"))
    )
  `)

  const [rootSymbol, derivedSymbol] = library.symbols
  expect(rootSymbol?.extends).toBeUndefined()
  expect(derivedSymbol?.extends).toBe("74LS245")
  expect(derivedSymbol?.getChildren()[0]).toBeInstanceOf(SymbolExtends)
})

test("derived symbols can be constructed and edited", () => {
  const symbol = new SchematicSymbol({
    libraryId: "74HC245",
    extends: "74LS245",
  })
  expect(symbol.getString()).toMatchInlineSnapshot(`
    "(symbol "74HC245"
      (extends "74LS245")
    )"
  `)

  symbol.extends = new SymbolExtends("74LS245_Split")
  expect(symbol.extends).toBe("74LS245_Split")

  symbol.extends = undefined
  expect(symbol.getString()).not.toContain("extends")
})

// KiCad's official 4xxx library derives "4066" from "4016". KiCad refuses to
// load a library that writes the parent as an unquoted (extends 4016).
test("extends keeps numeric-looking parent names quoted", () => {
  const library = new KicadSymbolLib({
    symbols: [new SchematicSymbol({ libraryId: "4066", extends: "4016" })],
  })

  const output = library.getString()
  expect(output).toContain('(symbol "4066"\n    (extends "4016")')
  expect(parseKicadSym(output).symbols[0]?.extends).toBe("4016")
})

test.each([
  '(symbol "74HC245" (extends))',
  '(symbol "74HC245" (extends "74LS245" "74LS244"))',
  '(symbol "74HC245" (extends ("74LS245")))',
])("extends rejects malformed input: %s", (symbolSource) => {
  expect(() => parseKicadSym(`(kicad_symbol_lib ${symbolSource})`)).toThrow(
    "extends expects a single parent symbol name",
  )
})

test("extends is only accepted inside a symbol", () => {
  expect(() => parseKicadSym('(kicad_symbol_lib (extends "74LS245"))')).toThrow(
    'Class "extends" not registered for parent "kicad_symbol_lib"',
  )
})
