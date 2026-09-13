import { expect, test } from "bun:test"
import { FootprintPad, PcbArc, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

const parents = ["pad", "segment", "via", "zone", "gr_arc"]
const parseArc = (input: string) =>
  SxClass.parsePrimitiveSexpr(parseToPrimitiveSExpr(input)[0]!, {
    parentToken: "kicad_pcb",
  }) as PcbArc

for (const parentToken of parents) {
  test.each(["001", "1e3", "0"])(
    `${parentToken} preserves the numeric-looking net name %s`,
    (name) => {
      const input = `(net "${name}")`
      const net = SxClass.parsePrimitiveSexpr(
        parseToPrimitiveSExpr(input)[0]!,
        { parentToken },
      ) as SxClass
      expect(net.getString()).toBe(input)
      const roundTrip = SxClass.parsePrimitiveSexpr(
        parseToPrimitiveSExpr(net.getString())[0]!,
        { parentToken },
      ) as SxClass
      expect(roundTrip.getString()).toBe(input)
    },
  )

  test(`${parentToken} preserves legacy numeric net IDs`, () => {
    const input = parentToken === "pad" ? '(net 3 "001")' : "(net 3)"
    const net = SxClass.parsePrimitiveSexpr(parseToPrimitiveSExpr(input)[0]!, {
      parentToken,
    }) as SxClass
    expect(net.getString()).toBe(input)
  })
}

test.each(["001", "1e3", "0"])("PCB arc preserves net name %s", (name) => {
  const arc = parseArc(`
    (arc (start 0 0) (mid 1 1) (end 2 0)
      (width 0.25) (layer "F.Cu") (net "${name}"))
  `)
  expect(arc.net).toBe(name)
  expect(arc.getString()).toContain(`(net "${name}")`)
  const roundTrip = parseArc(arc.getString())
  expect(roundTrip.net).toBe(name)
})

test("a footprint pad with a numeric net name parses without a legacy net ID", () => {
  const [pad] = SxClass.parse(`
    (pad "1" smd rect (at 0 0) (size 1 1)
      (layers "F.Cu") (net "001"))
  `) as [FootprintPad]
  expect(pad.net?.id).toBeUndefined()
  expect(pad.net?.name).toBe("001")
  const [roundTrip] = SxClass.parse(pad.getString()) as [FootprintPad]
  expect(roundTrip.net?.name).toBe("001")
})

test("PCB arc preserves legacy net IDs", () => {
  const arc = parseArc(`
    (arc (start 0 0) (mid 1 1) (end 2 0)
      (width 0.25) (layer "F.Cu") (net 3))
  `)
  expect(arc.net).toBe(3)
  expect(arc.getString()).toContain("(net 3)")
})
