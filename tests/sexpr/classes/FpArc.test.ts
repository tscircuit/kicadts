import { FpArc, Layer, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

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
  expect(fpArc.uuid?.value).toBe("12340000-0000-0000-0000-000000000000")

  fpArc.locked = true

  expect(fpArc.getString()).toMatchInlineSnapshot(`
    "(fp_arc
      (start 0 0)
      (mid 1 1)
      (end 2 0)
      (layer F.SilkS)
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
