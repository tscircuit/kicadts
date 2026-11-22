import { expect, test } from "bun:test"
import { parseKicadSym } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

// Reduced from KiCad's official "video" demo library, where 74HC245 is derived
// from 74LS245 with an `(extends ...)` child:
// https://gitlab.com/kicad/code/kicad/-/blob/b7066f886375b186ca8fa469de3a6382f6bba400/demos/video/libs/video_schlib.kicad_sym#L24170
const derivedSymbolLibrary = `
  (kicad_symbol_lib
    (version 20241209)
    (generator "kicad_symbol_editor")
    (symbol "74LS245"
      (exclude_from_sim no)
      (in_bom yes)
      (on_board yes)
      (property "Reference" "U"
        (at 2.54 14.605 0)
      )
      (property "Value" "74LS245"
        (at 1.27 -14.605 0)
      )
    )
    (symbol "74HC245"
      (extends "74LS245")
      (property "Reference" "U"
        (at 2.54 14.605 0)
      )
      (property "Value" "74HC245"
        (at 1.27 -14.605 0)
      )
    )
  )
`

test("kicad_sym: derived symbols parse and keep their extends parent", () => {
  const library = parseKicadSym(derivedSymbolLibrary)

  expect(library.symbols.map((symbol) => symbol.libraryId)).toEqual([
    "74LS245",
    "74HC245",
  ])
  const extendsStrings = library.symbols.map((symbol) =>
    symbol
      .getChildren()
      .filter((child) => child.token === "extends")
      .map((child) => child.getString()),
  )
  expect(extendsStrings).toEqual([[], ['(extends "74LS245")']])

  const output = library.getString()
  expect(parseToPrimitiveSExpr(output)).toEqual(
    parseToPrimitiveSExpr(derivedSymbolLibrary),
  )
  expect(parseKicadSym(output).getString()).toBe(output)
})
