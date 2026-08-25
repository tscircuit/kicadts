import {
  FootprintPad,
  PadLayers,
  PadNet,
  PadSize,
  PadDrill,
  SxClass,
} from "lib/sexpr"
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
  expect(fpPad.size).toBeInstanceOf(PadSize)
  expect(fpPad.size?.width).toBe(1.2)
  expect(fpPad.size?.height).toBe(0.6)
  expect(fpPad.drill).toBeInstanceOf(PadDrill)
  expect(fpPad.drill?.oval).toBe(false)
  expect(fpPad.drill?.diameter).toBe(0.3)
  expect(fpPad.layers).toBeInstanceOf(PadLayers)
  expect(fpPad.layers?.layers).toEqual(["F.Cu", "F.Paste", "F.Mask"])
  expect(fpPad.roundrectRatio).toBe(0.25)
  expect(fpPad.chamferCorners).toEqual(["top_left", "bottom_right"])
  expect(fpPad.net).toBeInstanceOf(PadNet)
  expect(fpPad.net?.id).toBe(3)
  expect(fpPad.net?.name).toBe("SIG")
  expect(fpPad.pinfunction).toBe("SIG")
  expect(fpPad.pintype).toBe("input")
  expect(fpPad.locked).toBe(true)

  expect(fpPad.getString()).toMatchInlineSnapshot(`
    "(pad \"1\" smd roundrect
      (at 1.5 -2.5 180)
      (size 1.2 0.6)
      (drill 0.3)
      (layers F.Cu F.Paste F.Mask)
      (roundrect_rratio 0.25)
      (chamfer top_left bottom_right)
      (net 3 \"SIG\")
      (pinfunction SIG)
      (pintype input)
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

test("KiCad 10.99 offset-only drill child", () => {
  const [parsed] = SxClass.parse(`
    (pad "41" smd rect
      (at -8.75 2.889996 -90)
      (size 0.4 1.8)
      (drill
        (offset 0 -0.4)
      )
      (layers "F.Cu" "F.Mask" "F.Paste")
    )
  `)

  const pad = parsed as FootprintPad
  expect(pad.drill?.diameter).toBe(0)
  expect(pad.drill?.offset).toMatchObject({ x: 0, y: -0.4 })
  expect(pad.getString()).toContain(`(drill
    (offset 0 -0.4)
  )`)
})
