import { expect, test } from "bun:test"
import { SchematicSymbol, SxClass, SymbolArc } from "lib/sexpr"

test("parses legacy symbol arcs with radius geometry", () => {
  const [parsed] = SxClass.parse(`
    (symbol "Legacy:Arc"
      (arc
        (start 1 2)
        (end 3 4)
        (radius
          (at 5 6)
          (length 7)
          (angles -89.9 89.9)
        )
      )
    )
  `)
  expect(parsed).toBeInstanceOf(SchematicSymbol)
  const symbol = parsed as SchematicSymbol
  expect(symbol.arcs).toHaveLength(1)
  const arc = symbol.arcs[0] as SymbolArc
  expect(arc.radius?.at).toMatchObject({ x: 5, y: 6 })
  expect(arc.radius?.length).toBe(7)
  expect(arc.radius?.angles).toMatchObject({ start: -89.9, end: 89.9 })
  expect(symbol.getString()).toMatchInlineSnapshot(`
    "(symbol "Legacy:Arc"
      (arc
        (start 1 2)
        (end 3 4)
        (radius
          (at 5 6)
          (length 7)
          (angles -89.9 89.9)
        )
      )
    )"
  `)
})
