import { expect, test } from "bun:test"
import {
  type KicadPcb,
  type KicadSch,
  type KicadSymbolLib,
  SxClass,
} from "../../../lib/sexpr"
import {
  parseToPrimitiveSExpr,
  printSExpr,
} from "../../../lib/sexpr/parseToPrimitiveSExpr"
import {
  needsQuoting,
  quoteIfNeeded,
} from "../../../lib/sexpr/utils/quoteSExprString"

test("numeric-looking string values are quoted", () => {
  for (const numericString of [
    "0",
    "10",
    "9.99",
    "-1e6",
    "+3.5",
    ".5",
    "5.",
    "1E-3",
  ]) {
    expect(needsQuoting(numericString)).toBe(true)
    expect(quoteIfNeeded(numericString)).toBe(`"${numericString}"`)
    expect(printSExpr(numericString)).toBe(`"${numericString}"`)
    expect(parseToPrimitiveSExpr(quoteIfNeeded(numericString))).toEqual([
      numericString,
    ])
  }

  // plain identifiers already round-trip as strings, so leave them unquoted
  for (const identifier of ["hello", "F.Cu", "8.0-tscircuit", "v1.0"]) {
    expect(needsQuoting(identifier)).toBe(false)
    expect(quoteIfNeeded(identifier)).toBe(identifier)
    expect(printSExpr(identifier)).toBe(identifier)
  }
})

test("reserved S-expression literals and comment-prefixed strings are quoted", () => {
  for (const special of ["", "#t", "#f", "nil", ";comment", "a\\b"]) {
    expect(needsQuoting(special)).toBe(true)
    const serialized = quoteIfNeeded(special)
    expect(serialized.startsWith('"')).toBe(true)
    expect(parseToPrimitiveSExpr(serialized)).toEqual([special])
    expect(parseToPrimitiveSExpr(printSExpr(special))).toEqual([special])
  }
})

test("numeric generator_version strings round-trip across KicadSch, KicadPcb, and KicadSymbolLib", () => {
  const [sch] = SxClass.parse(`
    (kicad_sch
      (version 20250114)
      (generator "eeschema")
      (generator_version "9.0")
    )
  `)
  const schOutput = (sch as KicadSch).getString()
  expect(schOutput).toContain('(generator_version "9.0")')
  const [schReparsed] = SxClass.parse(schOutput)
  expect((schReparsed as KicadSch).generatorVersion).toBe("9.0")

  const [pcb] = SxClass.parse(`
    (kicad_pcb
      (version 20240108)
      (generator "pcbnew")
      (generator_version "10.0")
    )
  `)
  const pcbOutput = (pcb as KicadPcb).getString()
  expect(pcbOutput).toContain('(generator_version "10.0")')
  const [pcbReparsed] = SxClass.parse(pcbOutput)
  expect((pcbReparsed as KicadPcb).generatorVersion).toBe("10.0")

  const [sym] = SxClass.parse(`
    (kicad_symbol_lib
      (version 20231120)
      (generator "kicad_symbol_editor")
      (generator_version "9.99")
    )
  `)
  const symOutput = (sym as KicadSymbolLib).getString()
  expect(symOutput).toContain('(generator_version "9.99")')
  const [symReparsed] = SxClass.parse(symOutput)
  expect((symReparsed as KicadSymbolLib).generatorVersion).toBe("9.99")
})
