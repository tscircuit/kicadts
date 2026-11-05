import { expect, test } from "bun:test"
import { parseKicadPcb } from "../../lib/sexpr/parseKicadSexpr"
import { parseToPrimitiveSExpr } from "../../lib/sexpr/parseToPrimitiveSExpr"

test.each(['"', '"truncated\\"'])(
  "rejects an unterminated string ending in a quote: %j",
  (input) => {
    expect(() => parseToPrimitiveSExpr(input)).toThrow(SyntaxError)
  },
)

test.each(['"', '"truncated\\"'])(
  "rejects an unterminated string after a complete board: %j",
  (input) => {
    expect(() => parseKicadPcb(`(kicad_pcb) ${input}`)).toThrow(SyntaxError)
  },
)

test.each([
  ['""', ""],
  ['"text"', "text"],
  ['"escaped\\"quote"', 'escaped"quote'],
  ['"escaped\\""', 'escaped"'],
  ['"backslash\\\\"', "backslash\\"],
  ['"line\\nbreak"', "line\nbreak"],
])("parses a terminated string at EOF: %j", (input, expected) => {
  expect(parseToPrimitiveSExpr(input)).toEqual([expected])
})

test.each(['"text', '"text\\', '(value "text'])(
  "continues to reject other unterminated strings: %j",
  (input) => {
    expect(() => parseToPrimitiveSExpr(input)).toThrow(SyntaxError)
  },
)

test("continues parsing after a closing quote", () => {
  expect(parseToPrimitiveSExpr('(value "escaped\\"") (next "")')).toEqual([
    ["value", 'escaped"'],
    ["next", ""],
  ])
})
