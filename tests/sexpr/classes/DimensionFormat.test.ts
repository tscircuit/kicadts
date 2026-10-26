import { expect, test } from "bun:test"
import { DimensionFormat } from "lib/sexpr"

test("DimensionFormat parses suppress_zeroes yes", () => {
  const format = DimensionFormat.fromSexprPrimitives([
    ["units", 3],
    ["units_format", 1],
    ["precision", 2],
    ["suppress_zeroes", "yes"],
  ])

  expect(format.getString()).toContain("(suppress_zeroes yes)")
})

test("DimensionFormat parses suppress_zeroes no", () => {
  const format = DimensionFormat.fromSexprPrimitives([
    ["units", 3],
    ["units_format", 1],
    ["precision", 2],
    ["suppress_zeroes", "no"],
  ])

  expect(format.getString()).toContain("(suppress_zeroes no)")
})
