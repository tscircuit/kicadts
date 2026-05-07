import { expect, test } from "bun:test"
import { KicadPcb, PcbArc, SxClass, Via } from "lib/sexpr"

test.skip("kicad_pcb: ESP32-C3 IoT battery PCB", async () => {
  const path = "tests/assets/esp32-c3-iot-battery-pcb.kicad_pcb"
  const original = await Bun.file(path).text()
  const classes = SxClass.parse(original)

  expect(classes).toHaveLength(1)
  expect(classes[0]).toBeInstanceOf(KicadPcb)
  const pcb = classes[0] as KicadPcb

  expect(pcb.vias.length).toBeGreaterThan(0)
  expect(pcb.vias[0]).toBeInstanceOf(Via)

  expect(pcb.arcs.length).toBeGreaterThan(0)
  expect(pcb.arcs[0]).toBeInstanceOf(PcbArc)

  const roundTrip = classes.map((instance) => instance.getString()).join("\n")
  expect(roundTrip).toContain("(kicad_pcb")
  expect(roundTrip).toContain("(via")
  expect(roundTrip).toContain("(arc")
})
