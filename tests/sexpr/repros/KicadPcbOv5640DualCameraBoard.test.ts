import { readFileSync } from "node:fs"
import { expect, test } from "bun:test"
import { KicadPcb, parseKicadPcb } from "lib"

test("KiCad PCB repro: OV5640 dual camera board", () => {
  const pcb = parseKicadPcb(
    readFileSync("tests/assets/OV5640-dual-camera-board.kicad_pcb", "utf-8"),
  )

  expect(pcb).toBeInstanceOf(KicadPcb)
  expect(pcb.footprints.length).toBeGreaterThan(0)
  expect(pcb.segments.length).toBeGreaterThan(0)
  expect(pcb.zones.length).toBeGreaterThan(0)
})
