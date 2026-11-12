import { expect, test } from "bun:test"
import { PadZoneLayerConnections, parseKicadPcb } from "lib/sexpr"

test("pad zone connections preserve the no-argument empty factory", () => {
  const connections = PadZoneLayerConnections.fromSexprPrimitives()
  expect(connections).toBeInstanceOf(PadZoneLayerConnections)
  expect(connections.getString()).toBe("(zone_layer_connections)")
})

// Synthetic PTH pad based on KiCad 10.0.5's parser and writer:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L6386-L6404
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr.cpp#L1790-L1815
const padWithConnections = (
  connections: string,
  number = "1",
) => `(pad "${number}" thru_hole circle
  (at 2.5 -1) (size 2 2) (drill 1) (layers "*.Cu" "*.Mask")
  (remove_unused_layers yes) (keep_end_layers no)
  ${connections}
  (net 1 "GND")
  (uuid "00000000-0000-0000-0000-00000000000${number}")
)`

const boardWithPads = (...pads: string[]) => `(kicad_pcb
  (version 20260206) (generator "pcbnew")
  (general (thickness 1.6))
  (layers (0 "F.Cu" signal) (4 "In1.Cu" signal)
    (6 "In2.Cu" signal) (2 "B.Cu" signal)
    (1 "F.Mask" user) (3 "B.Mask" user))
  (net 1 "GND")
  (footprint "Test:ThroughHole" (layer "F.Cu") ${pads.join("\n")})
)`

test.each([
  { field: '(zone_layer_connections "F.Cu")', layers: ["F.Cu"] },
  { field: '(zone_layer_connections "In1.Cu")', layers: ["In1.Cu"] },
  {
    field: '(zone_layer_connections "F.Cu" "In2.Cu" "B.Cu")',
    layers: ["F.Cu", "In2.Cu", "B.Cu"],
  },
])("pad copper layer overrides survive round-trip: %j", ({ field, layers }) => {
  const board = parseKicadPcb(boardWithPads(padWithConnections(field)))
  const output = board.getString()
  expect(output).toContain(field)

  for (const parsed of [board, parseKicadPcb(output)]) {
    const pad = parsed.footprints[0]!.fpPads[0]!
    expect(pad.zoneLayerConnections?.layers).toEqual(layers)
    expect(pad.number).toBe("1")
    expect(pad.at?.x).toBe(2.5)
    expect(pad.at?.y).toBe(-1)
    expect(pad.drill?.diameter).toBe(1)
    expect(pad.removeUnusedLayer).toBe(true)
    expect(pad.keepEndLayers).toBe(false)
    expect(pad.net?.id).toBe(1)
    expect(pad.net?.name).toBe("GND")
    expect(pad.uuid?.value).toBe("00000000-0000-0000-0000-000000000001")
  }
})

test("empty and absent pad overrides remain distinct from a populated neighbor", () => {
  const board = parseKicadPcb(
    boardWithPads(
      padWithConnections('(zone_layer_connections "B.Cu")'),
      padWithConnections("(zone_layer_connections)", "2"),
      padWithConnections("", "3"),
    ),
  )
  for (const parsed of [board, parseKicadPcb(board.getString())]) {
    const pads = parsed.footprints[0]!.fpPads
    expect(pads).toHaveLength(3)
    expect(pads[0]?.zoneLayerConnections?.getString()).toBe(
      '(zone_layer_connections "B.Cu")',
    )
    expect(pads[1]?.zoneLayerConnections?.getString()).toBe(
      "(zone_layer_connections)",
    )
    expect(pads[2]?.zoneLayerConnections).toBeUndefined()
  }
})

test("pad overrides can be created, changed, cleared, and removed", () => {
  const board = parseKicadPcb(boardWithPads(padWithConnections("")))
  const pad = board.footprints[0]!.fpPads[0]!
  pad.zoneLayerConnections = new PadZoneLayerConnections(["F.Cu", "B.Cu"])
  expect(board.getString()).toContain('(zone_layer_connections "F.Cu" "B.Cu")')
  pad.zoneLayerConnections.layers = ["In1.Cu"]
  expect(
    parseKicadPcb(board.getString()).footprints[0]!.fpPads[0]!
      .zoneLayerConnections?.layers,
  ).toEqual(["In1.Cu"])
  pad.zoneLayerConnections.layers = []
  expect(board.getString()).toContain("(zone_layer_connections)")
  pad.zoneLayerConnections = undefined
  expect(board.getString()).not.toContain("zone_layer_connections")
})

test.each(["(layer F.Cu)", "#t", "nil", "0"])(
  "pad overrides reject non-layer primitive %s",
  (invalid) => {
    expect(() =>
      parseKicadPcb(
        boardWithPads(
          padWithConnections(`(zone_layer_connections ${invalid})`),
        ),
      ),
    ).toThrow(/layer name/)
  },
)

test("pad overrides retain the existing repeated-child rejection", () => {
  expect(() =>
    parseKicadPcb(
      boardWithPads(
        padWithConnections(
          '(zone_layer_connections "F.Cu") (zone_layer_connections "B.Cu")',
        ),
      ),
    ),
  ).toThrow(/multiple|repeated/)
})
