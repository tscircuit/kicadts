import { expect, test } from "bun:test"
import { GrText, KicadPcb, SxClass, Zone } from "lib/sexpr"

test("kicad_pcb: Cyclometer repro", async () => {
  const original = await Bun.file("tests/assets/Cyclometer_v1.kicad_pcb").text()

  expect(original).toMatch(
    /\(gr_text "GND"\s+\(at 122 52\.2 0\)\s+\(layer "F\.SilkS"\)\s+\(effects/,
  )
  expect(original).toContain("(locked yes)")

  const classes = SxClass.parse(original)
  expect(classes).toHaveLength(1)
  expect(classes[0]).toBeInstanceOf(KicadPcb)
  const pcb = classes[0] as KicadPcb

  expect(pcb.graphicTexts).toHaveLength(25)
  expect(pcb.graphicTexts[0]).toBeInstanceOf(GrText)
  expect(pcb.graphicTexts[0]?.uuid).toBeUndefined()
  expect(pcb.graphicTexts[0]?.tstamp).toBeUndefined()

  expect(pcb.zones).toHaveLength(1)
  expect(pcb.zones[0]).toBeInstanceOf(Zone)
  expect(pcb.zones[0]?.locked).toBe(true)

  const roundTrip = classes.map((instance) => instance.getString()).join("\n")
  const reparsedClasses = SxClass.parse(roundTrip)
  expect(reparsedClasses).toHaveLength(1)
})
