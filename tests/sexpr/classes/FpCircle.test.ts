import { FpCircle, Layer, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("FpCircle", () => {
  const [circle] = SxClass.parse(`
    (fp_circle
      (center 1 1)
      (end 2 1)
      (layer F.SilkS)
      (stroke (width 0.1) (type dash) (color 0.2 0.2 0.2 1))
      (uuid 55555555-6666-7777-8888-999999999999)
    )
  `)

  expect(circle).toBeInstanceOf(FpCircle)
  const fpCircle = circle as FpCircle
  expect(fpCircle.center?.x).toBe(1)
  expect(fpCircle.end?.x).toBe(2)
  expect(fpCircle.layer).toBeInstanceOf(Layer)
  expect(fpCircle.stroke).toBeInstanceOf(Stroke)
  expect(fpCircle.uuid).toBe("55555555-6666-7777-8888-999999999999")

  fpCircle.locked = true

  expect(fpCircle.getString()).toMatchInlineSnapshot(`
    "(fp_circle
      (center 1 1)
      (end 2 1)
      (layer F.SilkS)
      (stroke
        (width 0.1)
        (type dash)
        (color 0.2 0.2 0.2 1)
      )
      (uuid 55555555-6666-7777-8888-999999999999)
      locked
    )"
  `)
})
