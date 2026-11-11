import { expect, test } from "bun:test"
import { At, HierarchicalLabel, KicadSch, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

test("KicadSch parses and round-trips hierarchical labels", () => {
  const input = `(kicad_sch
    (version 20250114)
    (generator "eeschema")
    (uuid "8f0c6ab6-4a6f-4f3f-a1d1-64b6d16c3a30")
    (paper "A4")
    (hierarchical_label "GPIO26{slash}AD0"
      (shape bidirectional)
      (at 137.16 121.92 0)
      (fields_autoplaced yes)
      (effects (font (size 1.27 1.27)) (justify left))
      (uuid "00c5f34b-3d96-481e-8852-bd44fd1b4539")
    )
  )`
  const [parsed] = SxClass.parse(input)
  const schematic = parsed as KicadSch
  const [gpio] = schematic.hierarchicalLabels

  expect(gpio).toBeInstanceOf(HierarchicalLabel)
  expect(gpio?.value).toBe("GPIO26{slash}AD0")
  expect(gpio?.shape).toBe("bidirectional")
  expect(gpio?.at).toBeInstanceOf(At)
  expect(gpio?.at?.x).toBe(137.16)
  expect(gpio?.fieldsAutoplaced).toBe(true)

  expectEqualPrimitiveSExpr(
    parseToPrimitiveSExpr(schematic.getString()),
    parseToPrimitiveSExpr(input),
  )
})
