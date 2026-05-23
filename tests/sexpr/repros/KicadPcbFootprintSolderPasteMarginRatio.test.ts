import { expect, test } from "bun:test"
import { FootprintSolderPasteMarginRatio, parseKicadPcb } from "lib/sexpr"

test("kicad_pcb: parses footprint-level solder_paste_margin_ratio", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (version 20240108)
      (generator pcbnew)
      (footprint "Test:Part"
        (layer "F.Cu")
        (solder_paste_margin_ratio -1)
        (attr smd)
      )
    )
  `)

  expect(pcb.footprints).toHaveLength(1)
  const footprint = pcb.footprints[0]!
  expect(footprint.solderPasteRatio).toBeInstanceOf(
    FootprintSolderPasteMarginRatio,
  )
  expect(footprint.solderPasteRatio?.value).toBe(-1)
  expect(footprint.solderPasteMarginRatio?.value).toBe(-1)
})
