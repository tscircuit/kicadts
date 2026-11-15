import { expect, test } from "bun:test"
import { parseKicadPcb } from "lib/sexpr"

// KiCad 10.0.5 accepts both the legacy bare flag and an empty locked
// expression in parsePCB_TRACK, in addition to modern yes/no values:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L7312-L7390
const boardWithSegment = (lock: string) => `(kicad_pcb
  (segment ${lock}
    (start 12.5 -8) (end 20 -3.5) (width 0.25)
    (layer "F.Cu") (net 1)
    (uuid "a044d689-ea35-4835-9587-e36441a878d7")
  )
)`

test.each([
  { lock: "locked", expected: true },
  { lock: "(locked)", expected: true },
  { lock: "(locked yes)", expected: true },
  { lock: "(locked no)", expected: false },
  { lock: "", expected: false },
])("segment lock %j survives round-trip", ({ lock, expected }) => {
  const board = parseKicadPcb(boardWithSegment(lock))
  const output = board.getString()

  for (const parsed of [board, parseKicadPcb(output)]) {
    expect(parsed.segments).toHaveLength(1)
    const segment = parsed.segments[0]!
    expect(segment.locked).toBe(expected)
    expect(segment.startPoint).toEqual({ x: 12.5, y: -8 })
    expect(segment.endPoint).toEqual({ x: 20, y: -3.5 })
    expect(segment.width).toBe(0.25)
    expect(segment.layer?.names).toEqual(["F.Cu"])
    expect(segment.net?.id).toBe(1)
    expect(segment.uuid?.value).toBe("a044d689-ea35-4835-9587-e36441a878d7")
  }

  if (expected) expect(output).toContain("(locked yes)")
})

test.each(["locked", "(locked)"])(
  "a legacy %s segment can be unlocked after parsing",
  (lock) => {
    const board = parseKicadPcb(boardWithSegment(lock))
    const segment = board.segments[0]!
    expect(segment.locked).toBe(true)
    segment.locked = false
    expect(parseKicadPcb(board.getString()).segments[0]?.locked).toBe(false)
  },
)

test("segments reject repeated lock expressions", () => {
  expect(() =>
    parseKicadPcb(boardWithSegment("(locked yes) (locked no)")),
  ).toThrow(/repeated child tokens/)
})
