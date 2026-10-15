import { expect, test } from "bun:test"
import { parseKicadPcb, ZoneFill } from "lib/sexpr"

test("ZoneFill parses and round-trips hatched copper settings", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb (version 20221018) (generator pcbnew)
      (zone (net 27) (net_name "GND") (layer "B.Cu")
        (fill yes (mode hatch)
          (thermal_gap 0.3) (thermal_bridge_width 0.45)
          (island_removal_mode 1) (island_area_min 10)
          (hatch_thickness 0.3) (hatch_gap 1.5) (hatch_orientation 45)
          (hatch_border_algorithm hatch_thickness) (hatch_min_hole_area 0.3))
      )
    )
  `)
  const fill = pcb.zones[0]!.fill!

  expect(fill.filled).toBe(true)
  expect(fill.mode).toBe("hatch")
  expect(fill.hatchThickness).toBe(0.3)
  expect(fill.hatchGap).toBe(1.5)
  expect(fill.hatchOrientation).toBe(45)
  expect(fill.hatchBorderAlgorithm).toBe("hatch_thickness")
  expect(fill.hatchMinHoleArea).toBe(0.3)
  expect(fill.thermalGap).toBe(0.3)
  expect(fill.thermalBridgeWidth).toBe(0.45)
  expect(fill.islandRemovalMode).toBe(1)
  expect(fill.islandAreaMin).toBe(10)
  expect(parseKicadPcb(pcb.getString()).zones[0]!.fill).toEqual(fill)
})

test("ZoneFill constructs and clears hatch settings", () => {
  const fill = new ZoneFill({
    filled: true,
    mode: "hatch",
    hatchThickness: 0.3,
    hatchGap: 1.5,
    hatchOrientation: 45,
    hatchBorderAlgorithm: "hatch_thickness",
    hatchMinHoleArea: 0.3,
  })

  expect(fill.getString()).toBe(`(fill yes
  (mode hatch)
  (hatch_thickness 0.3)
  (hatch_gap 1.5)
  (hatch_orientation 45)
  (hatch_border_algorithm hatch_thickness)
  (hatch_min_hole_area 0.3)
)`)

  fill.mode = undefined
  fill.hatchThickness = undefined
  fill.hatchGap = undefined
  fill.hatchOrientation = undefined
  fill.hatchBorderAlgorithm = undefined
  fill.hatchMinHoleArea = undefined
  expect(fill.getString()).toBe("(fill yes)")
})

test("ZoneFill still rejects repeated hatch settings", () => {
  expect(() =>
    ZoneFill.fromSexprPrimitives(["yes", ["hatch_gap", 1.5], ["hatch_gap", 2]]),
  ).toThrow('zone fill does not support repeated child "hatch_gap"')
})

test("ZoneFill preserves solid fill without hatch settings", () => {
  const fill = ZoneFill.fromSexprPrimitives(["yes", ["thermal_gap", 0.3]])

  expect(fill.mode).toBeUndefined()
  expect(fill.hatchGap).toBeUndefined()
  expect(fill.getString()).toBe("(fill yes\n  (thermal_gap 0.3)\n)")
})
