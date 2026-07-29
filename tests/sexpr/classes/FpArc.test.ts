import { FpArc, Layer, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"
import { parseKicadMod } from "lib/sexpr/parseKicadSexpr"

test("FpArc", () => {
  const [arc] = SxClass.parse(`
    (fp_arc
      (start 0 0)
      (mid 1 1)
      (end 2 0)
      (layer F.SilkS)
      (stroke (width 0.12) (type solid) (color 0 0 1 1))
      (uuid 12340000-0000-0000-0000-000000000000)
    )
  `)

  expect(arc).toBeInstanceOf(FpArc)
  const fpArc = arc as FpArc
  expect(fpArc.start?.x).toBe(0)
  expect(fpArc.mid?.y).toBe(1)
  expect(fpArc.end?.x).toBe(2)
  expect(fpArc.layer).toBeInstanceOf(Layer)
  expect(fpArc.stroke).toBeInstanceOf(Stroke)
  expect(fpArc.uuid).toBe("12340000-0000-0000-0000-000000000000")

  fpArc.width = 0.25
  expect(fpArc.width).toBe(0.25)
  fpArc.locked = true

  expect(fpArc.getString()).toMatchInlineSnapshot(`
    "(fp_arc
      (start 0 0)
      (mid 1 1)
      (end 2 0)
      (layer F.SilkS)
      (width 0.25)
      (stroke
        (width 0.12)
        (type solid)
        (color 0 0 1 1)
      )
      (uuid 12340000-0000-0000-0000-000000000000)
      locked
    )"
  `)
})

test("FpArc supports the legacy start/end/angle form", () => {
  const [arc] = SxClass.parse(`
    (fp_arc
      (start 0 -1.0541)
      (end 0.3048 -1.0541)
      (angle 180)
      (layer F.Fab)
      (width 0.1524)
    )
  `)

  expect(arc).toBeInstanceOf(FpArc)
  const fpArc = arc as FpArc
  expect(fpArc.angle).toBe(180)

  fpArc.angle = 90
  expect(fpArc.angleClass?.value).toBe(90)
  expect(fpArc.getString()).toMatchInlineSnapshot(`
    "(fp_arc
      (start 0 -1.0541)
      (end 0.3048 -1.0541)
      (angle 90)
      (layer F.Fab)
      (width 0.1524)
    )"
  `)
})

test("parseKicadMod supports an angle arc in a legacy module root", () => {
  const footprint = parseKicadMod(`
    (module BQ25186DLHR
      (layer F.Cu)
      (fp_arc
        (start 0 -1.0541)
        (end 0.3048 -1.0541)
        (angle 180)
        (layer F.Fab)
        (width 0.1524)
      )
    )
  `)

  expect(footprint.libraryLink).toBe("BQ25186DLHR")
  expect(footprint.fpArcs[0]?.angle).toBe(180)
  expect(footprint.getString()).toStartWith("(footprint")
})
