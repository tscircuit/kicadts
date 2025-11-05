import { GrPoly, Layer, Stroke, SxClass, Pts, PtsArc, Xy } from "lib/sexpr"
import { expect, test } from "bun:test"

test("GrPoly - basic parsing with arc", () => {
  const [poly] = SxClass.parse(`
    (gr_poly
        (pts
            (xy 4.8 -57.500001) (xy 4.8 -60.2) (xy 7.5 -60.199996)
            (arc
                (start 7.5 -60.2)
                (mid 3.226585 -61.773415)
                (end 4.8 -57.5)
            )
        )
        (stroke
            (width 0)
            (type solid)
        )
        (fill yes)
        (layer "F.Cu")
        (uuid "5355e3dd-6dec-4c48-b42e-8bfce7721f71")
    )
  `)

  expect(poly).toBeInstanceOf(GrPoly)
  const grPoly = poly as GrPoly
  expect(grPoly.points).toBeInstanceOf(Pts)
  expect(grPoly.points?.points).toHaveLength(4) // 3 xy + 1 arc
  expect(grPoly.points?.points[0]).toBeInstanceOf(Xy)
  expect(grPoly.points?.points[3]).toBeInstanceOf(PtsArc)
  expect(grPoly.layer).toBeInstanceOf(Layer)
  expect(grPoly.stroke).toBeInstanceOf(Stroke)
  expect(grPoly.fill).toBe(true)
  expect(grPoly.uuid).toBe("5355e3dd-6dec-4c48-b42e-8bfce7721f71")
})

test("GrPoly - simple polygon without arc", () => {
  const [poly] = SxClass.parse(`
    (gr_poly
        (pts
            (xy 0 0) (xy 10 0) (xy 10 10) (xy 0 10)
        )
        (stroke
            (width 0.1)
            (type default)
        )
        (fill no)
        (layer "B.Cu")
        (uuid "12345678-1234-1234-1234-123456789012")
    )
  `)

  const grPoly = poly as GrPoly
  expect(grPoly.points?.points).toHaveLength(4)
  expect(grPoly.points?.points.every((p) => p instanceof Xy)).toBe(true)
  expect(grPoly.fill).toBe(false)
})

test("GrPoly - constructor", () => {
  const grPoly = new GrPoly({
    points: [
      { x: 0, y: 0 },
      { x: 5, y: 5 },
      { x: 10, y: 0 },
    ],
    layer: "F.Cu",
    fill: true,
    uuid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
  })

  expect(grPoly.points).toBeInstanceOf(Pts)
  expect(grPoly.points?.points).toHaveLength(3)
  expect(grPoly.fill).toBe(true)
  expect(grPoly.uuid).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
})

test("GrPoly - getString output", () => {
  const [poly] = SxClass.parse(`
    (gr_poly
        (pts
            (xy 0 0) (xy 10 0) (xy 10 10)
        )
        (stroke
            (width 0.1)
            (type solid)
        )
        (fill yes)
        (layer "F.Cu")
        (uuid "5355e3dd-6dec-4c48-b42e-8bfce7721f71")
    )
  `)

  const grPoly = poly as GrPoly
  const output = grPoly.getString()

  expect(output).toContain("(gr_poly")
  expect(output).toContain("(pts")
  expect(output).toContain("(xy 0 0)")
  expect(output).toContain("(xy 10 0)")
  expect(output).toContain("(xy 10 10)")
  expect(output).toContain("(stroke")
  expect(output).toContain("(fill yes)")
  expect(output).toContain("(layer F.Cu)")
  expect(output).toContain("5355e3dd-6dec-4c48-b42e-8bfce7721f71")
})

test("PtsArc - parsing and properties", () => {
  const [poly] = SxClass.parse(`
    (gr_poly
        (pts
            (xy 0 0)
            (arc
                (start 1 1)
                (mid 2 2)
                (end 3 3)
            )
        )
        (layer "F.Cu")
    )
  `)

  const grPoly = poly as GrPoly
  const arc = grPoly.points?.points[1] as PtsArc
  expect(arc).toBeInstanceOf(PtsArc)
  expect(arc.start?.x).toBe(1)
  expect(arc.start?.y).toBe(1)
  expect(arc.mid?.x).toBe(2)
  expect(arc.mid?.y).toBe(2)
  expect(arc.end?.x).toBe(3)
  expect(arc.end?.y).toBe(3)
})
