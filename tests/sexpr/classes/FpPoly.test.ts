import { FpPoly, Layer, Pts, Stroke, SxClass } from "lib/sexpr"
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
