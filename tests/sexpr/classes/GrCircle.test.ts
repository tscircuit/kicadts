import { GrCircle, Layer, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("GrCircle - basic parsing with locked", () => {
  const [circle] = SxClass.parse(`
    (gr_circle
        (center 25 -35)
        (end 25 -34.85)
        (stroke
            (width 0.1)
            (type solid)
        )
        (fill yes)
        (locked yes)
        (layer "User.1")
        (uuid "04317cef-467f-443a-af53-453cce07bf76")
    )
  `)

  expect(circle).toBeInstanceOf(GrCircle)
  const grCircle = circle as GrCircle
  expect(grCircle.centerPoint).toEqual({ x: 25, y: -35 })
  expect(grCircle.endPoint).toEqual({ x: 25, y: -34.85 })
  expect(grCircle.layer).toBeInstanceOf(Layer)
  expect(grCircle.stroke).toBeInstanceOf(Stroke)
  expect(grCircle.locked).toBe(true)
  expect(grCircle.uuid).toBe("04317cef-467f-443a-af53-453cce07bf76")
})

test("GrCircle - without locked property", () => {
  const [circle] = SxClass.parse(`
    (gr_circle
        (center 10 20)
        (end 15 20)
        (stroke
            (width 0.2)
            (type default)
        )
        (layer "F.Cu")
        (uuid "12345678-1234-1234-1234-123456789012")
    )
  `)

  const grCircle = circle as GrCircle
  expect(grCircle.locked).toBe(false)
})

test("GrCircle - getter/setter", () => {
  const grCircle = new GrCircle({
    center: { x: 10, y: 20 },
    end: { x: 15, y: 20 },
    layer: "F.Cu",
  })

  expect(grCircle.centerPoint).toEqual({ x: 10, y: 20 })
  expect(grCircle.endPoint).toEqual({ x: 15, y: 20 })

  grCircle.locked = true
  expect(grCircle.locked).toBe(true)

  grCircle.locked = false
  expect(grCircle.locked).toBe(false)
})

test("GrCircle - getString output with locked", () => {
  const [circle] = SxClass.parse(`
    (gr_circle
        (center 25 -35)
        (end 25 -34.85)
        (stroke
            (width 0.1)
            (type solid)
        )
        (fill yes)
        (locked yes)
        (layer "User.1")
        (uuid "04317cef-467f-443a-af53-453cce07bf76")
    )
  `)

  const grCircle = circle as GrCircle
  const output = grCircle.getString()

  // Verify the output contains all expected elements
  expect(output).toContain("(gr_circle")
  expect(output).toContain("(center 25 -35)")
  expect(output).toContain("(end 25 -34.85)")
  expect(output).toContain("(stroke")
  expect(output).toContain("(fill yes)")
  expect(output).toContain("(locked yes)")
  expect(output).toContain("(layer User.1)")
  expect(output).toContain("04317cef-467f-443a-af53-453cce07bf76")
})
