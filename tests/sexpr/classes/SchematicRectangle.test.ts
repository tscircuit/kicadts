import { expect, test } from "bun:test"
import {
  SchematicRectangle,
  Stroke,
  SymbolRectangleFill,
  Uuid,
} from "lib/sexpr"

test("SchematicRectangle constructor serializes start, end, stroke, fill, and uuid", () => {
  const stroke = new Stroke()
  stroke.width = 0.12
  stroke.type = "default"

  const fill = new SymbolRectangleFill()
  fill.type = "none"

  const rectangle = new SchematicRectangle({
    start: { x: 0, y: 0 },
    end: { x: 10, y: 5 },
    stroke,
    fill,
    uuid: "12345678-1234-1234-1234-123456789abc",
  })

  expect(rectangle.start?.x).toBe(0)
  expect(rectangle.end?.y).toBe(5)
  expect(rectangle.stroke).toBe(stroke)
  expect(rectangle.fill).toBe(fill)
  expect(rectangle.uuid).toBeInstanceOf(Uuid)

  expect(rectangle.getString()).toMatchInlineSnapshot(`
    "(rectangle
      (start 0 0)
      (end 10 5)
      (stroke
        (width 0.12)
        (type default)
      )
      (fill
        (type none)
      )
      (uuid 12345678-1234-1234-1234-123456789abc)
    )"
  `)
})
