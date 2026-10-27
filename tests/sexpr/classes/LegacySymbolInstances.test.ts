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
    value: "/sheet/symbol",
    reference: "U31",
    unit: 8,
    symbolValue: "XC7Z010-1CLG400I",
    footprint: "Package_BGA:Xilinx_CSG324",
  })
  expect(schematic.getString()).toContain("(symbol_instances")
  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.symbolInstances?.paths[0]).toMatchObject({
    value: "/sheet/symbol",
    reference: "U31",
    unit: 8,
    symbolValue: "XC7Z010-1CLG400I",
    footprint: "Package_BGA:Xilinx_CSG324",
  })
})

test("preserves multiple legacy instance paths and empty optional strings", () => {
  const schematic = parseKicadSch(`(kicad_sch
    (symbol_instances
      (path "/sheet/R1" (reference "R1") (unit 1) (value "10k") (footprint ""))
      (path "/sheet/R2" (reference "R2") (unit 1) (value "") (footprint "Resistor_SMD:R_0402"))
    )
  )`)
  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.symbolInstances?.paths).toHaveLength(2)
  expect(reparsed.symbolInstances?.paths[0]).toMatchObject({
    value: "/sheet/R1",
    reference: "R1",
    symbolValue: "10k",
    footprint: "",
  })
  expect(reparsed.symbolInstances?.paths[1]).toMatchObject({
    value: "/sheet/R2",
    reference: "R2",
    symbolValue: "",
    footprint: "Resistor_SMD:R_0402",
  })
})
