import { expect, test } from "bun:test"
import { KicadSym, SxClass, SymbolPinAlternate, parseKicadSym } from "lib/sexpr"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

const numericLike = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/

const normalizePrimitive = (value: PrimitiveSExpr): PrimitiveSExpr => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizePrimitive(item))
  }

  if (typeof value === "string" && numericLike.test(value)) {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return Object.is(parsed, -0) ? 0 : parsed
    }
  }

  if (typeof value === "number" && Object.is(value, -0)) {
    return 0
  }

  return value
}

test("kicad_sym: CM5IO parses symbol pin alternates", async () => {
  const path = "tests/assets/CM5IO.kicad_sym"
  const original = await Bun.file(path).text()
  const sym = parseKicadSym(original)

  expect(sym).toBeInstanceOf(KicadSym)
  expect(sym.symbols.length).toBeGreaterThan(0)

  const alternates = sym.symbols.flatMap((symbol) =>
    symbol.subSymbols.flatMap((subSymbol) =>
      subSymbol.pins.flatMap((pin) => pin.alternates),
    ),
  )

  expect(alternates.length).toBeGreaterThan(0)
  expect(alternates[0]).toBeInstanceOf(SymbolPinAlternate)

  const roundTrip = SxClass.parse(original)
    .map((instance) => instance.getString())
    .join("\n")

  const originalPrimitive = parseToPrimitiveSExpr(original).map((form) =>
    normalizePrimitive(form),
  )

  const roundTripPrimitive = parseToPrimitiveSExpr(roundTrip).map((form) =>
    normalizePrimitive(form),
  )

  expectEqualPrimitiveSExpr(roundTripPrimitive, originalPrimitive, { path })
})
