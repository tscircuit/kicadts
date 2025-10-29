import { SxClass, Polyline, KicadSch, Pts, Stroke, Uuid } from "lib/sexpr"
import { expect, test } from "bun:test"

test("Polyline", () => {
  const [parsed] = SxClass.parse(`
	(kicad_sch
        (polyline
            (pts
                (xy 172.72 196.85) (xy 148.59 196.85)
            )
            (stroke
                (width 0)
                (type dash)
            )
            (uuid "088f800b-89af-4049-b7bd-bc3ee6bc7fd7")
        )
	)
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const kicadSch = parsed as KicadSch
  expect(kicadSch.polylines).toHaveLength(1)

  const polyline = kicadSch.polylines[0]
  expect(polyline).toBeInstanceOf(Polyline)
  const pl = polyline as Polyline
  expect(pl.points).toBeInstanceOf(Pts)
  expect(pl.stroke).toBeInstanceOf(Stroke)
  expect(pl.uuid).toBeInstanceOf(Uuid)

  expect(pl.getString()).toMatchInlineSnapshot(`
    "(polyline
      (pts
        (xy 172.72 196.85)
        (xy 148.59 196.85)
      )
      (stroke
        (width 0)
        (type dash)
      )
      (uuid 088f800b-89af-4049-b7bd-bc3ee6bc7fd7)
    )"
  `)
})
