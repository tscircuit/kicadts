import { expect, test } from "bun:test"
import {
  needsQuoting,
  quoteIfNeeded,
} from "../../../lib/sexpr/utils/quoteSExprString"

// A string value that looks like a number must be quoted, otherwise it is
// emitted bare (e.g. `(property "Value" 9.99)`) and re-parses as the number
// 9.99 instead of the string "9.99" -- breaking round-trip for string fields.
test.failing("numeric-looking string values are quoted", () => {
  expect(needsQuoting("9.99")).toBe(true)
  expect(quoteIfNeeded("9.99")).toBe('"9.99"')
  expect(quoteIfNeeded("10")).toBe('"10"')
  expect(quoteIfNeeded("-1e6")).toBe('"-1e6"')

  // plain identifiers already round-trip as strings, so leave them unquoted
  expect(quoteIfNeeded("hello")).toBe("hello")
})
