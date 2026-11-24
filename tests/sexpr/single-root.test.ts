import { expect, test } from "bun:test"
import {
  parseKicadMod,
  parseKicadPcb,
  parseKicadSch,
  parseKicadSym,
} from "lib/sexpr/parseKicadSexpr"

const cases = [
  [
    "kicad_sch",
    parseKicadSch,
    '(kicad_sch (version 20250114) (generator eeschema) (uuid 00000000-0000-0000-0000-000000000000) (paper "A4"))',
  ],
  [
    "kicad_pcb",
    parseKicadPcb,
    "(kicad_pcb (version 20221018) (generator pcbnew))",
  ],
  [
    "kicad_symbol_lib",
    parseKicadSym,
    "(kicad_symbol_lib (version 20211014) (generator kicad_symbol_editor))",
  ],
  ["footprint", parseKicadMod, '(footprint "R_0603")'],
] as const

test("document parsers reject trailing top-level expressions", () => {
  for (const [name, parse, source] of cases) {
    expect(parse(source).token).toBe(name)
    expect(() => parse(`${source} ${source}`)).toThrow(
      "exactly one top-level expression",
    )
    expect(() => parse(`${source} trailing`)).toThrow(
      "exactly one top-level expression",
    )
  }
})
