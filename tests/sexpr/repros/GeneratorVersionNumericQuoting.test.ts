import { expect, test } from "bun:test"
import { parseKicadPcb, parseKicadMod, KicadPcb } from "../../../lib"
import { needsQuoting } from "../../../lib/sexpr/utils/quoteSExprString"

// KiCad writes (generator_version "10.99"). Emitted bare, it reads back as the
// number 10.99 -- a different value, and for "10.99.1" a different document.
test("a numeric generator_version stays quoted and round-trips as a string", () => {
  const src = `(kicad_pcb
	(version 20260728)
	(generator "pcbnew")
	(generator_version "10.99")
)`
  const pcb = parseKicadPcb(src)
  expect(pcb.generatorVersion).toBe("10.99")

  const out = pcb.getStringIndented()
  expect(out).toContain(`(generator_version "10.99")`)

  const reparsed = parseKicadPcb(out)
  expect(reparsed.generatorVersion).toBe("10.99")
  expect(typeof reparsed.generatorVersion).toBe("string")
})

test("a multi-part version is not mangled", () => {
  const src = `(kicad_pcb (version 20260728) (generator "pcbnew") (generator_version "10.99.1"))`
  const out = parseKicadPcb(src).getStringIndented()
  expect(parseKicadPcb(out).generatorVersion).toBe("10.99.1")
})

// KiCad 6 and 7 wrote these bare; that output shape is still produced.
test("a non-numeric generator is still emitted bare", () => {
  const src = `(kicad_pcb (version 20211014) (generator pcbnew))`
  const out = parseKicadPcb(src).getStringIndented()
  expect(out).toContain("(generator pcbnew)")
  expect(parseKicadPcb(out).generator).toBe("pcbnew")
})

test("footprint generator_version round-trips too", () => {
  const src = `(footprint "X" (version 20240108) (generator "pcbnew") (generator_version "9.0") (layer "F.Cu"))`
  const out = parseKicadMod(src).getStringIndented()
  expect(out).toContain(`(generator_version "9.0")`)
})

test("needsQuoting treats number-like tokens as requiring quotes", () => {
  for (const v of ["10.99", "8.0", "-3", "1e5", ".5", "20260728"])
    expect(needsQuoting(v)).toBe(true)
  for (const v of ["pcbnew", "kicad_symbol_editor", "F.Cu", "10.99.1", "abc"])
    expect(needsQuoting(v)).toBe(false)
})

// The lexer reads nil, #t and #f as literals and treats a leading ";" as a comment,
// so a bare token of that shape changes type or breaks the document on reparse.
test("reserved literals and comment-prefixed tokens stay quoted", () => {
  for (const g of ["#t", "#f", "nil", ";evil"]) {
    const pcb = new KicadPcb({ version: 20260728, generator: g })
    const out = pcb.getStringIndented()
    expect(out).toContain(`(generator "${g}")`)
    const back = parseKicadPcb(out).generator
    expect(back).toBe(g)
    expect(typeof back).toBe("string")
  }
})

test("needsQuoting covers reserved literals and comment prefixes", () => {
  for (const v of ["nil", "#t", "#f", ";x", ";"])
    expect(needsQuoting(v)).toBe(true)
  for (const v of ["pcbnew", "nils", "#tt", "a;b"])
    expect(needsQuoting(v)).toBe(false)
})
