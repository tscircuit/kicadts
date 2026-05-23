import { expect, test } from "bun:test"
import { Dimension, parseKicadPcb } from "lib/sexpr"

test("kicad_pcb: parses top-level dimension with tstamp identity", () => {
  const pcb = parseKicadPcb(`
    (kicad_pcb
      (version 20221018)
      (generator pcbnew)

      (layers
        (0 "F.Cu" signal)
        (31 "B.Cu" signal)
        (39 "F.Mask" user)
        (44 "Edge.Cuts" user)
        (47 "F.CrtYd" user)
        (49 "F.Fab" user)
        (40 "Dwgs.User" user)
      )

      (dimension (type aligned) (layer "Dwgs.User") (tstamp c3040ab3-51b7-4163-9186-37ee7d9f88a9)
        (pts (xy 135.45 113.085001) (xy 82.491 113.085001))
        (height -5.714999)
        (gr_text "52.9590 mm" (at 108.9705 117.65) (layer "Dwgs.User") (tstamp c3040ab3-51b7-4163-9186-37ee7d9f88a9)
          (effects (font (size 1 1) (thickness 0.15)))
        )
        (format (prefix "") (suffix "") (units 2) (units_format 1) (precision 4))
        (style (thickness 0.15) (arrow_length 1.27) (text_position_mode 0) (extension_height 0.58642) (extension_offset 0) keep_text_aligned)
      )
    )
  `)

  expect(pcb.otherChildren).toHaveLength(1)
  const dimension = pcb.otherChildren[0] as Dimension
  expect(dimension).toBeInstanceOf(Dimension)
  expect(dimension.tstamp?.value).toBe("c3040ab3-51b7-4163-9186-37ee7d9f88a9")
  expect(dimension.uuid).toBeUndefined()
  expect(dimension.getString()).toContain(
    "(tstamp c3040ab3-51b7-4163-9186-37ee7d9f88a9)",
  )
})
