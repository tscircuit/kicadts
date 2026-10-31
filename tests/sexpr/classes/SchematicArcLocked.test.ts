import { expect, test } from "bun:test"
import { KicadSch, parseKicadSch, SchematicArc } from "lib/sexpr"

// Geometry from the existing "KicadSch parses root arcs" acceptance test.
const schematicWithArc = (locked = "") => `(kicad_sch
  (arc
    (start 163.5 112.5)
    (mid 148.5 97.5)
    (end 133.5 112.5)
    (stroke (width 0.75) (type default))
    (uuid 040e42d7-787e-4aba-984f-3ca88a39a07a)
    ${locked}
  )
)`

test("locking a parsed schematic arc preserves it through serialization", () => {
  const schematic = parseKicadSch(schematicWithArc())
  schematic.arcs[0]!.locked = true

  const output = schematic.getString()
  const reparsed = parseKicadSch(output)
  expect(reparsed.arcs).toHaveLength(1)
  expect(reparsed.arcs[0]?.locked).toBe(true)
  expect(reparsed.arcs[0]?.start).toMatchObject({ x: 163.5, y: 112.5 })
  expect(reparsed.arcs[0]?.mid).toMatchObject({ x: 148.5, y: 97.5 })
  expect(reparsed.arcs[0]?.end).toMatchObject({ x: 133.5, y: 112.5 })
  expect(reparsed.arcs[0]?.stroke?.width).toBe(0.75)
  expect(reparsed.arcs[0]?.uuid?.value).toBe(
    "040e42d7-787e-4aba-984f-3ca88a39a07a",
  )
  expect(output).toContain("(locked yes)")
})

test.each([true, false])(
  "constructed schematic arc with locked=%s round-trips",
  (locked) => {
    const schematic = new KicadSch({
      arcs: [
        new SchematicArc({
          start: { x: 1, y: 0 },
          mid: { x: 0, y: 1 },
          end: { x: -1, y: 0 },
          locked,
        }),
      ],
    })
    const reparsed = parseKicadSch(schematic.getString())
    expect(reparsed.arcs[0]?.locked).toBe(locked)
  },
)

test.each([
  ["yes", true],
  ["no", false],
  ["true", true],
  ["false", false],
  ["#t", true],
  ["#f", false],
] as const)("schematic arc lock %s round-trips", (token, locked) => {
  const schematic = parseKicadSch(schematicWithArc(`(locked ${token})`))
  expect(schematic.arcs[0]?.locked).toBe(locked)
  const output = schematic.getString()
  expect(output).toContain(locked ? "(locked yes)" : "(locked no)")
  expect(parseKicadSch(output).arcs[0]?.locked).toBe(locked)
})

test("unlocking a schematic arc removes its lock", () => {
  const schematic = parseKicadSch(schematicWithArc())
  schematic.arcs[0]!.locked = true
  schematic.arcs[0]!.locked = false
  const output = schematic.getString()
  expect(output).not.toContain("(locked")
  expect(parseKicadSch(output).arcs[0]?.locked).toBe(false)
})

test.each(["maybe", "0", "1", "nil", '""', "(yes)", ""])(
  "schematic arc rejects invalid lock value %s",
  (value) => {
    expect(() =>
      parseKicadSch(schematicWithArc(`(locked ${value})`)),
    ).toThrow()
  },
)

test("schematic arc continues rejecting unsupported children", () => {
  expect(() =>
    parseKicadSch(schematicWithArc("(unsupported_arc_child yes)")),
  ).toThrow()
})
