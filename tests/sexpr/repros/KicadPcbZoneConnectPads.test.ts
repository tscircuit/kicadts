import { expect, test } from "bun:test"
import { parseKicadPcb } from "lib/sexpr"

const pcbWithConnectPads = (connectPads: string) => `
  (kicad_pcb
    (version 20221018)
    (generator pcbnew)

    (layers
      (0 "F.Cu" signal)
      (31 "B.Cu" signal)
      (39 "F.Mask" user)
      (44 "Edge.Cuts" user)
    )

    (net 0 "")
    (net 1 "GND")

    (zone
      (net 1)
      (net_name "GND")
      (layer "F.Cu")
      (tstamp 00000000-0000-0000-0000-000000000001)
      (hatch edge 0.508)
      ${connectPads}
      (min_thickness 0.254)
      (filled_areas_thickness no)
      (keepout
        (tracks not_allowed)
        (vias allowed)
        (pads allowed)
        (copperpour allowed)
        (footprints allowed)
      )
      (fill yes (thermal_gap 0.508) (thermal_bridge_width 0.508))
      (polygon
        (pts
          (xy 0 0)
          (xy 10 0)
          (xy 10 10)
          (xy 0 10)
        )
      )
    )
  )
`

test("kicad_pcb: parses zone connect_pads thru_hole_only", () => {
  const pcb = parseKicadPcb(
    pcbWithConnectPads("(connect_pads thru_hole_only (clearance 0.127))"),
  )

  const zone = pcb.zones[0]!
  expect(zone.connectPads?.mode).toBe("thru_hole_only")
  expect(zone.connectPads?.enabled).toBe(true)
  expect(zone.connectPads?.clearance).toBe(0.127)
  expect(zone.connectPads?.getString()).toContain(
    "(connect_pads thru_hole_only",
  )
})

test("kicad_pcb: parses zone connect_pads yes and no", () => {
  const yesPcb = parseKicadPcb(
    pcbWithConnectPads("(connect_pads yes (clearance 0.15))"),
  )
  const noPcb = parseKicadPcb(
    pcbWithConnectPads("(connect_pads no (clearance 0.15))"),
  )

  expect(yesPcb.zones[0]?.connectPads?.mode).toBe("yes")
  expect(yesPcb.zones[0]?.connectPads?.enabled).toBe(true)
  expect(noPcb.zones[0]?.connectPads?.mode).toBe("no")
  expect(noPcb.zones[0]?.connectPads?.enabled).toBe(false)
})
