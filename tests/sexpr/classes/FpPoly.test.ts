import { FpPoly, Footprint, Layer, Pts, Stroke, SxClass } from "lib/sexpr"
import { parseKicadMod } from "lib/sexpr/parseKicadSexpr"
import { expect, test } from "bun:test"

test("FpPoly", () => {
  const [poly] = SxClass.parse(`
    (fp_poly
      (pts (xy 0 0) (xy 1 0) (xy 1 1) (xy 0 1))
      (layer F.SilkS)
      (stroke (width 0.1) (type solid) (color 0 0 0 1))
      (fill yes)
      (uuid 10101010-2020-3030-4040-505050505050)
    )
  `)

  expect(poly).toBeInstanceOf(FpPoly)
  const fpPoly = poly as FpPoly
  expect(fpPoly.points).toBeInstanceOf(Pts)
  expect(fpPoly.layer).toBeInstanceOf(Layer)
  expect(fpPoly.stroke).toBeInstanceOf(Stroke)
  expect(fpPoly.fill?.filled).toBe(true)

  fpPoly.locked = true

  expect(fpPoly.getString()).toMatchInlineSnapshot(`
    "(fp_poly
      (pts
        (xy 0 0)
        (xy 1 0)
        (xy 1 1)
        (xy 0 1)
      )
      (layer F.SilkS)
      (stroke
        (width 0.1)
        (type solid)
        (color 0 0 0 1)
      )
      (fill yes)
      (locked yes)
      (uuid 10101010-2020-3030-4040-505050505050)
    )"
  `)
})

test("FpPoly parses without uuid or tstamp", () => {
  const [poly] = SxClass.parse(`
    (fp_poly
      (pts
        (xy -0.5 -0.5)
        (xy 0.5 -0.5)
        (xy 0.5 0.5)
        (xy -0.5 0.5)
        (xy -0.5 -0.5)
      )
      (stroke (width 0.12) (type solid))
      (fill none)
      (layer "F.SilkS")
    )
  `)

  expect(poly).toBeInstanceOf(FpPoly)
  const fpPoly = poly as FpPoly
  expect(fpPoly.uuid).toBeUndefined()
  expect(fpPoly.tstamp).toBeUndefined()
  expect(fpPoly.getString()).not.toContain("(uuid")
  expect(fpPoly.getString()).not.toContain("(tstamp")
})

test("parseKicadMod accepts fp_poly without uuid or tstamp", async () => {
  const footprint = parseKicadMod(
    await Bun.file("tests/assets/fp_poly_without_uuid_tstamp.kicad_mod").text(),
  )

  expect(footprint).toBeInstanceOf(Footprint)
  expect(footprint.fpPolys).toHaveLength(1)
  expect(footprint.fpPolys[0]?.uuid).toBeUndefined()
  expect(footprint.fpPolys[0]?.tstamp).toBeUndefined()
})
