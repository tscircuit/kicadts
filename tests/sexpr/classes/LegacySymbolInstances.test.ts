import { expect, test } from "bun:test"
import { parseKicadSch } from "lib"

test("parses legacy top-level symbol instances", () => {
  const schematic = parseKicadSch(`
    (kicad_sch
      (version 20210126)
      (generator eeschema)
      (symbol_instances
        (path "/sheet/symbol"
          (reference "U31")
          (unit 8)
          (value "XC7Z010-1CLG400I")
          (footprint "Package_BGA:Xilinx_CSG324")
        )
      )
    )
  `)

  expect(schematic.symbolInstances?.paths).toHaveLength(1)
  expect(schematic.symbolInstances?.paths[0]).toMatchObject({
    reference: "U31",
    unit: 8,
    symbolValue: "XC7Z010-1CLG400I",
    footprint: "Package_BGA:Xilinx_CSG324",
  })
  expect(schematic.getString()).toContain("(symbol_instances")
})
