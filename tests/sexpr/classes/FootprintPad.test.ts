import { FootprintPad, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("FootprintPad", () => {
  const [pad] = SxClass.parse(`
    (pad "1" smd roundrect
      (at 1.5 -2.5 180)
      (size 1.2 0.6)
      (drill 0.3)
      (layers F.Cu F.Paste F.Mask)
      (roundrect_rratio 0.25)
      (chamfer top_left bottom_right)
      (solder_mask_margin 0.05)
      (solder_paste_margin_ratio -0.1)
      (clearance 0.15)
      (zone_connect 1)
      (thermal_gap 0.2)
      (thermal_width 0.12)
      (net 3 "SIG")
      (pinfunction "SIG")
      (pintype "input")
      (uuid 55555555-6666-7777-8888-999999999999)
      locked
    )
  `)

  expect(pad).toBeInstanceOf(FootprintPad)
  const fpPad = pad as FootprintPad
  expect(fpPad.number).toBe("1")
  expect(fpPad.padType).toBe("smd")
  expect(fpPad.shape).toBe("roundrect")
  expect(fpPad.at).toBeDefined()
  expect(fpPad.size).toEqual({ width: 1.2, height: 0.6 })
  expect(fpPad.drill).toEqual({ oval: false, diameter: 0.3, extras: [] })
  expect(fpPad.layers).toEqual(["F.Cu", "F.Paste", "F.Mask"])
  expect(fpPad.roundrectRatio).toBe(0.25)
  expect(fpPad.chamferCorners).toEqual(["top_left", "bottom_right"])
  expect(fpPad.net).toEqual({ id: 3, name: "SIG" })
  expect(fpPad.pinfunction).toBe("SIG")
  expect(fpPad.pintype).toBe("input")
  expect(fpPad.locked).toBe(true)

  expect(fpPad.getString()).toMatchInlineSnapshot(`
    "(pad \"1\" smd roundrect
      (at 1.5 -2.5 180)
      (size 1.2 0.6)
      (drill 0.3)
      (layers \"F.Cu\" \"F.Paste\" \"F.Mask\")
      (roundrect_rratio 0.25)
      (chamfer top_left bottom_right)
      (net 3 \"SIG\")
      (pinfunction \"SIG\")
      (pintype \"input\")
      (solder_mask_margin 0.05)
      (solder_paste_margin_ratio -0.1)
      (clearance 0.15)
      (zone_connect 1)
      (thermal_width 0.12)
      (thermal_gap 0.2)
      (uuid 55555555-6666-7777-8888-999999999999)
      locked
    )"
  `)
})
