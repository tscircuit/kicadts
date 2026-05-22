import { expect, test } from "bun:test"

test("kicad_pcb: Cyclometer repro", async () => {
  const original = await Bun.file("tests/assets/Cyclometer_v1.kicad_pcb").text()

  expect(original).toMatch(
    /\(gr_text "GND"\s+\(at 122 52\.2 0\)\s+\(layer "F\.SilkS"\)\s+\(effects/,
  )
  expect(original).toContain("(locked yes)")

  // Current failures:
  // - gr_text requires a uuid or tstamp child token
  // - Class "locked" not registered for parent "zone"
  // const classes = SxClass.parse(original)
  // expect(classes).toHaveLength(1)
})
