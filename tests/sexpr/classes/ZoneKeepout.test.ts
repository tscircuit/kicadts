import { expect, test } from "bun:test"
import { parseKicadPcb } from "lib/sexpr"

test("ZoneKeepout - parses a real KiCad board keepout", async () => {
  const board = await Bun.file("tests/assets/keepout.kicad_pcb").text()
  const pcb = parseKicadPcb(board)
  const keepoutZones = pcb.zones.filter((zone) => zone.keepout)

  expect(keepoutZones).toHaveLength(1)

  const zone = keepoutZones[0]!
  expect(zone.layer?.names).toEqual(["F.Cu"])
  expect(zone.keepout?.tracks).toBe("not_allowed")
  expect(zone.keepout?.vias).toBe("not_allowed")
  expect(zone.keepout?.pads).toBe("not_allowed")
  expect(zone.keepout?.copperpour).toBe("allowed")
  expect(zone.keepout?.footprints).toBe("allowed")
  expect(zone.keepout?.getString()).toMatchInlineSnapshot(`
    "(keepout
      (tracks not_allowed)
      (vias not_allowed)
      (pads not_allowed)
      (copperpour allowed)
      (footprints allowed)
    )"
  `)
})
