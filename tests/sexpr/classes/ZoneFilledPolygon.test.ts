import { expect, test } from "bun:test"
import { Layer, parseKicadPcb, Pts, Xy, ZoneFilledPolygon } from "lib/sexpr"

test("ZoneFilledPolygon constructor serializes layer, island, and pts", () => {
  const filledPolygon = new ZoneFilledPolygon({
    layer: new Layer(["F.Cu"]),
    island: true,
    pts: new Pts([new Xy(0, 0), new Xy(10, 0), new Xy(10, 10)]),
  })

  expect(filledPolygon.getString()).toMatchInlineSnapshot(`
    "(filled_polygon
      (layer F.Cu)
      (island)
      (pts
        (xy 0 0)
        (xy 10 0)
        (xy 10 10)
      )
    )"
  `)
})

test("kicad_pcb: parses zone island_removal_mode and filled_polygon islands", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (version 20221018)
      (generator pcbnew)

      (layers
        (0 "F.Cu" signal)
        (31 "B.Cu" signal)
      )

      (net 0 "")
      (net 1 "GND")

      (zone
        (net 1)
        (net_name "GND")
        (layer "F.Cu")
        (hatch edge 0.5)
        (connect_pads yes (clearance 0.15))
        (min_thickness 0.25)
        (filled_areas_thickness no)
        (fill yes
          (thermal_gap 0.5)
          (thermal_bridge_width 0.5)
          (island_removal_mode 0)
        )
        (polygon
          (pts
            (xy 0 0)
            (xy 20 0)
            (xy 20 20)
            (xy 0 20)
          )
        )
        (filled_polygon
          (layer "F.Cu")
          (island)
          (pts
            (xy 0 0)
            (xy 20 0)
            (xy 10 10)
          )
        )
      )
    )
  `)

  const zone = pcb.zones[0]!
  const filledPolygon = zone.filledPolygons[0]!

  expect(zone.fill?.islandRemovalMode).toBe(0)
  expect(zone.fill?.getString()).toContain("(island_removal_mode 0)")
  expect(filledPolygon.layer?.names).toEqual(["F.Cu"])
  expect(filledPolygon.island).toBe(true)
  expect(filledPolygon.pts?.points).toHaveLength(3)
  expect(zone.getString()).toContain("(filled_polygon")
  expect(zone.getString()).toContain("(island)")
})
