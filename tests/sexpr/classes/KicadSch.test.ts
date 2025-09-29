import {
  KicadSch,
  Paper,
  Property,
  SchematicSymbol,
  Sheet,
  SxClass,
  TitleBlock,
  Wire,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("KicadSch parse", () => {
  const [parsed] = SxClass.parse(`
    (kicad_sch
      (version 20240101)
      (generator kicad-cli)
      (uuid 01234567-89ab-cdef-0123-456789abcdef)
      (paper A4)
      (title_block
        (title "Demo")
        (company "Example Co")
      )
      (property "Sheetfile" "demo.kicad_sch")
      (sheet
        (at 0 0 0)
        (size 100 80)
        (uuid abcdefab-1234-5678-90ab-abcdefabcdef)
      )
      (symbol "Device:R"
        (at 25.4 12.7)
        (uuid fedcba98-7654-3210-fedc-ba9876543210)
      )
      (wire (pts (xy 0 0) (xy 10 10)))
    )
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch

  expect(schematic.version).toBe(20240101)
  expect(schematic.generator).toBe("kicad-cli")
  expect(schematic.uuid?.value).toBe(
    "01234567-89ab-cdef-0123-456789abcdef",
  )

  expect(schematic.paper).toBeInstanceOf(Paper)
  expect(schematic.titleBlock).toBeInstanceOf(TitleBlock)
  expect(schematic.titleBlock?.title).toBe("Demo")
  expect(schematic.titleBlock?.company).toBe("Example Co")

  expect(schematic.properties).toHaveLength(1)
  expect(schematic.properties[0]).toBeInstanceOf(Property)
  expect(schematic.properties[0]?.key).toBe("Sheetfile")
  expect(schematic.properties[0]?.value).toBe("demo.kicad_sch")

  expect(schematic.sheets).toHaveLength(1)
  expect(schematic.sheets[0]).toBeInstanceOf(Sheet)

  expect(schematic.symbols).toHaveLength(1)
  expect(schematic.symbols[0]).toBeInstanceOf(SchematicSymbol)

  expect(schematic.wires).toHaveLength(1)
  expect(schematic.wires[0]).toBeInstanceOf(Wire)

  expect(schematic.getString()).toMatchInlineSnapshot(`
    "(kicad_sch
      (version 20240101)
      (generator kicad-cli)
      (uuid 01234567-89ab-cdef-0123-456789abcdef)
      (paper
        A4
      )
      (title_block
        (title \"Demo\")
        (company \"Example Co\")
      )
      (property \"Sheetfile\" \"demo.kicad_sch\")
      (sheet
        (at 0 0 0)
        (size 100 80)
        (uuid abcdefab-1234-5678-90ab-abcdefabcdef)
      )
      (symbol \"Device:R\"
        (at 25.4 12.7)
        (uuid fedcba98-7654-3210-fedc-ba9876543210)
      )
      (wire (pts (xy 0 0) (xy 10 10)))
    )"
  `)
})
