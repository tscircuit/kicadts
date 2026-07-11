import { expect, test } from "bun:test"
import { GrArc, SxClass } from "lib/sexpr"

test("GrArc parses net string on copper graphic", () => {
  const [parsed] = SxClass.parse(`
    (gr_arc
      (start 102.98569 72.3)
      (mid 103.028646 72.084048)
      (end 103.150973 71.900973)
      (stroke
        (width 0.05)
        (type default)
      )
      (layer "F.Cu")
      (net "Net-(U6-RF2)")
      (uuid "190139b6-c221-4f12-8eed-525d6caa0a98")
    )
  `)

  const grArc = parsed as GrArc
  expect(grArc).toBeInstanceOf(GrArc)
  expect(grArc.net).toBe("Net-(U6-RF2)")
  expect(grArc.getString()).toContain('(net "Net-(U6-RF2)")')
})
