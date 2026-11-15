import { expect, test } from "bun:test"
import { FootprintPad, PadDrill, parseKicadMod, parseKicadPcb } from "lib/sexpr"

// Synthetic PTH fixtures, not native KiCad exports. Both empty flags mean true:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L6364-L6376
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L265-L293
const padText = (fields: string, number = "1") => `
  (pad "${number}" thru_hole circle
    (at 2.5 -1) (size 2 2) (drill 1) (layers "*.Cu" "*.Mask")
    ${fields} (net 1 "GND")
    (uuid "00000000-0000-0000-0000-00000000000${number}"))`

const footprintText = (...pads: string[]) => `
  (footprint "Test:CopperRemoval" (layer "F.Cu") ${pads.join("\n")})`

const boardText = (...pads: string[]) => `(kicad_pcb
  (version 20260206) (generator "pcbnew")
  (general (thickness 1.6))
  (layers (0 "F.Cu" signal) (4 "In1.Cu" signal)
    (6 "In2.Cu" signal) (2 "B.Cu" signal)
    (1 "F.Mask" user) (3 "B.Mask" user))
  (net 1 "GND") ${footprintText(...pads)})`

const flags = [
  { token: "remove_unused_layers", property: "removeUnusedLayer", other: "" },
  {
    token: "keep_end_layers",
    property: "keepEndLayers",
    other: "(remove_unused_layers yes)",
  },
] as const

for (const { token, property, other } of flags) {
  test.each([
    { flagText: null, enabled: false },
    { flagText: "", enabled: true },
    { flagText: "yes", enabled: true },
    { flagText: "true", enabled: true },
    { flagText: "no", enabled: false },
    { flagText: "false", enabled: false },
  ])(`${token} retains %j`, ({ flagText, enabled }) => {
    const field = flagText === null ? "" : `(${token} ${flagText})`
    const board = parseKicadPcb(boardText(padText(`${other} ${field}`)))
    expect(board.footprints[0]!.fpPads[0]![property]).toBe(enabled)
    if (flagText === null) {
      expect(board.getString()).not.toContain(token)
    } else {
      expect(board.getString()).toContain(
        `(${token} ${enabled ? "yes" : "no"})`,
      )
    }
    expect(
      parseKicadPcb(board.getString()).footprints[0]!.fpPads[0]![property],
    ).toBe(enabled)
  })

  test(`standalone footprint retains empty ${token}`, () => {
    const footprint = parseKicadMod(
      footprintText(padText(`${other} (${token})`)),
    )
    expect(footprint.getString()).toContain(`(${token} yes)`)
    expect(parseKicadMod(footprint.getString()).fpPads[0]![property]).toBe(true)
  })

  test.each(["maybe", "1", "(at 0 0)"])(
    `${token} continues rejecting invalid value %s`,
    (invalidFlagText) => {
      expect(() =>
        parseKicadPcb(
          boardText(padText(`${other} (${token} ${invalidFlagText})`)),
        ),
      ).toThrow()
    },
  )

  test(`${token} retains the existing repeated-child rejection`, () => {
    expect(() =>
      parseKicadPcb(boardText(padText(`${other} (${token}) (${token} no)`))),
    ).toThrow()
  })
}

test("repeated board serialization preserves both flags and neighboring pads", () => {
  let board = parseKicadPcb(
    boardText(
      padText("(remove_unused_layers) (keep_end_layers)", "1"),
      padText("(remove_unused_layers yes) (keep_end_layers no)", "2"),
      padText("", "3"),
    ),
  )
  for (let cycle = 0; cycle < 4; cycle++) {
    const pads = board.footprints[0]!.fpPads
    expect(
      pads.map((pad) => [pad.removeUnusedLayer, pad.keepEndLayers]),
    ).toEqual([
      [true, true],
      [true, false],
      [false, false],
    ])
    for (const [i, pad] of pads.entries()) {
      expect(pad.number).toBe(String(i + 1))
      expect(pad.at).toMatchObject({ x: 2.5, y: -1 })
      expect(pad.size).toMatchObject({ width: 2, height: 2 })
      expect(pad.drill?.diameter).toBe(1)
      expect(pad.layers?.layers).toEqual(["*.Cu", "*.Mask"])
      expect(pad.net).toMatchObject({ id: 1, name: "GND" })
      expect(pad.uuid?.value).toBe(
        `00000000-0000-0000-0000-00000000000${i + 1}`,
      )
    }
    board = parseKicadPcb(board.getString())
  }
})

test("moving a parsed pad does not change its unconnected copper settings", () => {
  const board = parseKicadPcb(
    boardText(padText("(remove_unused_layers) (keep_end_layers)")),
  )
  board.footprints[0]!.fpPads[0]!.at = { x: -3.25, y: 6.5, angle: 90 }
  const pad = parseKicadPcb(board.getString()).footprints[0]!.fpPads[0]!
  expect([pad.removeUnusedLayer, pad.keepEndLayers]).toEqual([true, true])
  expect(pad.at).toMatchObject({ x: -3.25, y: 6.5, angle: 90 })
})

test("public setters can disable and re-enable parsed empty flags", () => {
  const board = parseKicadPcb(
    boardText(padText("(remove_unused_layers) (keep_end_layers)")),
  )
  const pad = board.footprints[0]!.fpPads[0]!
  expect([pad.removeUnusedLayer, pad.keepEndLayers]).toEqual([true, true])
  for (const { token, property } of flags) {
    pad[property] = false
    expect(board.getString()).not.toContain(token)
    expect(
      parseKicadPcb(board.getString()).footprints[0]!.fpPads[0]![property],
    ).toBe(false)
    pad[property] = true
    expect(board.getString()).toContain(`(${token} yes)`)
    expect(
      parseKicadPcb(board.getString()).footprints[0]!.fpPads[0]![property],
    ).toBe(true)
  }
})

test("constructor and absent-field defaults keep their existing meaning", () => {
  const pad = new FootprintPad({
    number: "1",
    padType: "thru_hole",
    shape: "circle",
    at: [0, 0],
    size: { width: 2, height: 2 },
    drill: new PadDrill({ diameter: 1 }),
    layers: ["*.Cu", "*.Mask"],
    removeUnusedLayers: true,
    keepEndLayers: true,
  })
  for (const { property } of flags) {
    expect(
      parseKicadPcb(boardText(pad.getString())).footprints[0]!.fpPads[0]![
        property
      ],
    ).toBe(true)
    pad[property] = false
    expect(
      parseKicadPcb(boardText(pad.getString())).footprints[0]!.fpPads[0]![
        property
      ],
    ).toBe(false)
    expect(new FootprintPad()[property]).toBe(false)
  }
})
