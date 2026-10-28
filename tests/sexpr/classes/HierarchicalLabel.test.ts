import { expect, test } from "bun:test"
import { At, HierarchicalLabel, KicadSch, SxClass } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

const schematicWithHierarchicalLabels = `
(kicad_sch
  (version 20250114)
  (generator "eeschema")
  (uuid "8f0c6ab6-4a6f-4f3f-a1d1-64b6d16c3a30")
  (paper "A4")
  (hierarchical_label "GPIO26{slash}AD0"
    (shape bidirectional)
    (at 137.16 121.92 0)
    (effects
      (font
        (size 1.27 1.27)
      )
      (justify left)
    )
    (uuid "00c5f34b-3d96-481e-8852-bd44fd1b4539")
  )
  (hierarchical_label "RESET"
    (shape input)
    (at 50.8 76.2 180)
    (fields_autoplaced yes)
    (effects
      (font
        (size 1.27 1.27)
      )
      (justify right)
    )
    (uuid "5b0f2d1e-1b7a-4d55-9d0a-7d1c4d9f6e21")
  )
)
`

test("KicadSch parses and round-trips hierarchical labels", () => {
  const [parsed] = SxClass.parse(schematicWithHierarchicalLabels)
  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch

  const [gpio, reset] = schematic.hierarchicalLabels
  expect(gpio).toBeInstanceOf(HierarchicalLabel)
  expect(gpio?.value).toBe("GPIO26{slash}AD0")
  expect(gpio?.shape).toBe("bidirectional")
  expect(gpio?.at).toBeInstanceOf(At)
  expect(gpio?.at?.x).toBe(137.16)
  expect(gpio?.fieldsAutoplaced).toBe(false)
  expect(reset?.value).toBe("RESET")
  expect(reset?.shape).toBe("input")
  expect(reset?.at?.angle).toBe(180)
  expect(reset?.fieldsAutoplaced).toBe(true)

  const output = schematic.getString()
  expectEqualPrimitiveSExpr(
    parseToPrimitiveSExpr(output),
    parseToPrimitiveSExpr(schematicWithHierarchicalLabels),
  )
})
