import { expect, test } from "bun:test"
import { FootprintPoint, parseKicadMod, parseKicadPcb } from "lib/sexpr"

test("kicad_pcb parses a reference point", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (point
        (at 126.492 99.822)
        (size 1)
        (layer "F.Cu")
        (uuid "1f37e37b-7088-497b-b77e-39d2f3a35cc1")
      )
    )
  `)

  expect(pcb.otherChildren).toHaveLength(1)
  expect(pcb.otherChildren[0]).toBeInstanceOf(FootprintPoint)
  expect(pcb.otherChildren[0]!.getString()).toBe(`(point
  (at 126.492 99.822)
  (size 1)
  (layer F.Cu)
  (uuid 1f37e37b-7088-497b-b77e-39d2f3a35cc1)
)`)
})

test("footprint parses a reference point", () => {
  const footprint = parseKicadMod(`
    (footprint "Test:Point"
      (layer "F.Cu")
      (point
        (at 1 2)
        (size 1)
        (layer "F.Cu")
        (uuid "1f37e37b-7088-497b-b77e-39d2f3a35cc1")
      )
    )
  `)

  expect(footprint.points).toHaveLength(1)
  expect(footprint.points[0]).toBeInstanceOf(FootprintPoint)
  expect(footprint.points[0]!.getString()).toContain("(at 1 2)")
})
