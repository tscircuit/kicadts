import { GrRect, Layer, Stroke, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("GrRect - basic parsing", () => {
  const [rect] = SxClass.parse(`
    (gr_rect
        (start 0 -55)
        (end 90 0)
        (stroke
            (width 0.05)
            (type default)
        )
        (fill no)
        (locked yes)
        (layer "Edge.Cuts")
        (uuid "5b95af0e-1f3a-402d-b822-c10a6e4a88c8")
    )
  `)

  expect(rect).toBeInstanceOf(GrRect)
  const grRect = rect as GrRect
  expect(grRect.start?.x).toBe(0)
  expect(grRect.start?.y).toBe(-55)
  expect(grRect.end?.x).toBe(90)
  expect(grRect.end?.y).toBe(0)
  expect(grRect.layer).toBeInstanceOf(Layer)
  expect(grRect.stroke).toBeInstanceOf(Stroke)
  expect(grRect.fill).toBe(false)
  expect(grRect.locked).toBe(true)
  expect(grRect.uuid).toBe("5b95af0e-1f3a-402d-b822-c10a6e4a88c8")
})

test("GrRect - getter/setter", () => {
  const grRect = new GrRect({
    start: { x: 10, y: 20 },
    end: { x: 30, y: 40 },
    layer: "F.Cu",
  })

  expect(grRect.startPoint).toEqual({ x: 10, y: 20 })
  expect(grRect.endPoint).toEqual({ x: 30, y: 40 })

  grRect.fill = true
  expect(grRect.fill).toBe(true)

  grRect.locked = true
  expect(grRect.locked).toBe(true)
})

test("GrRect - getString output", () => {
  const [rect] = SxClass.parse(`
    (gr_rect
        (start 0 -55)
        (end 90 0)
        (stroke
            (width 0.05)
            (type default)
        )
        (fill no)
        (locked yes)
        (layer "Edge.Cuts")
        (uuid "5b95af0e-1f3a-402d-b822-c10a6e4a88c8")
    )
  `)

  const grRect = rect as GrRect
  const output = grRect.getString()

  // Verify the output contains all expected elements
  expect(output).toContain("(gr_rect")
  expect(output).toContain("(start 0 -55)")
  expect(output).toContain("(end 90 0)")
  expect(output).toContain("(stroke")
  expect(output).toContain("(fill no)")
  expect(output).toContain("(locked yes)")
  expect(output).toContain("(layer Edge.Cuts)")
  expect(output).toContain("5b95af0e-1f3a-402d-b822-c10a6e4a88c8")
})
