import { FpRect, Layer, Stroke, SxClass, Width } from "lib/sexpr"
import { expect, test } from "bun:test"

test("FpRect", () => {
  const [rect] = SxClass.parse(`
    (fp_rect
      (start 0 0)
      (end 5 5)
      (layer F.Cu)
      (stroke (width 0.2) (type solid) (color 1 0 0 1))
      (uuid 00000000-1111-2222-3333-444444444444)
    )
  `)

  expect(rect).toBeInstanceOf(FpRect)
  const fpRect = rect as FpRect
  expect(fpRect.start?.x).toBe(0)
  expect(fpRect.end?.y).toBe(5)
  expect(fpRect.layer).toBeInstanceOf(Layer)
  expect(fpRect.stroke).toBeInstanceOf(Stroke)
  expect(fpRect.uuid?.value).toBe("00000000-1111-2222-3333-444444444444")

  fpRect.width = new Width([0.3])

  expect(fpRect.getString()).toMatchInlineSnapshot(`
    "(fp_rect
      (start 0 0)
      (end 5 5)
      (layer F.Cu)
      (width 0.3)
      (stroke
        (width 0.2)
        (type solid)
        (color 1 0 0 1)
      )
      (uuid 00000000-1111-2222-3333-444444444444)
    )"
  `)
})
