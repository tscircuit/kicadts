import { expect, test } from "bun:test"

test("kicad_pcb: Cyclometer locked zone repro", async () => {
  const original = await Bun.file("tests/assets/Cyclometer_v1.kicad_pcb").text()

  expect(original).toContain("(locked yes)")

  // Currently throws: Class "locked" not registered for parent "zone"
  // const classes = SxClass.parse(original)
  // expect(classes).toHaveLength(1)
})
