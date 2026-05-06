import {
  KicadSch,
  Paper,
  Property,
  SchematicRectangle,
  SchematicSymbol,
  SchematicTextBox,
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
  expect(schematic.uuid?.value).toBe("01234567-89ab-cdef-0123-456789abcdef")

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
        (title "Demo")
        (company "Example Co")
      )
      (property "Sheetfile" "demo.kicad_sch"
      )
      (sheet
        (at 0 0 0)
        (size 100 80)
        (uuid abcdefab-1234-5678-90ab-abcdefabcdef)
      )
      (symbol "Device:R"
        (at 25.4 12.7)
        (uuid fedcba98-7654-3210-fedc-ba9876543210)
      )
      (wire
        (pts
          (xy 0 0)
          (xy 10 10)
        )
      )
    )"
  `)
})

test("KicadSch parses root rectangles and text boxes", () => {
  const [parsed] = SxClass.parse(`
    (kicad_sch
      (version 20240101)
      (generator eeschema)
      (uuid 01234567-89ab-cdef-0123-456789abcdef)
      (paper A4)
      (rectangle
        (start 134.62 35.814)
        (end 132.08 38.354)
        (stroke (width 0.0254) (type solid) (color 128 0 0 1))
        (fill (type color) (color 255 255 176 1))
        (uuid 040e42d7-787e-4aba-984f-3ca88a39a07a)
      )
      (text_box "75"
        (exclude_from_sim no)
        (at 177.8 81.534 0)
        (size 10.16 10.16)
        (stroke (width 0) (type default) (color 0 0 0 1))
        (fill (type none))
        (effects (font (size 2.54 2.54) (thickness 0.508) (bold yes)))
        (uuid "0087a9e2-23fa-483c-88c9-f4af0fc504e0")
      )
    )
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch
  expect(schematic.rectangles).toHaveLength(1)
  expect(schematic.rectangles[0]).toBeInstanceOf(SchematicRectangle)
  expect(schematic.textBoxes).toHaveLength(1)
  expect(schematic.textBoxes[0]).toBeInstanceOf(SchematicTextBox)
  expect(schematic.getString()).toContain('(text_box "75"')
})

test("KicadSch parse with lib_symbols, instances and sheet_instances", () => {
  const input = `(kicad_sch
    (version 20250114)
    (generator "eeschema")
    (generator_version "9.0")
    (uuid "7581b6ee-fd20-4dd8-85dd-91c70d13dcc0")
    (paper "A4")
    (lib_symbols
        (symbol "Device:R"
            (pin_numbers
                (hide yes)
            )
            (pin_names
                (offset 0)
            )
            (exclude_from_sim no)
            (in_bom yes)
            (on_board yes)
            (property "Reference" "R"
                (at 2.032 0 90)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                )
            )
            (property "Value" "R"
                (at 0 0 90)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                )
            )
            (property "Footprint" ""
                (at -1.778 0 90)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                    (hide yes)
                )
            )
            (property "Datasheet" "~"
                (at 0 0 0)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                    (hide yes)
                )
            )
            (property "Description" "Resistor"
                (at 0 0 0)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                    (hide yes)
                )
            )
            (property "ki_keywords" "R res resistor"
                (at 0 0 0)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                    (hide yes)
                )
            )
            (property "ki_fp_filters" "R_*"
                (at 0 0 0)
                (effects
                    (font
                        (size 1.27 1.27)
                    )
                    (hide yes)
                )
            )
            (symbol "R_0_1"
                (rectangle
                    (start -1.016 -2.54)
                    (end 1.016 2.54)
                    (stroke
                        (width 0.254)
                        (type default)
                    )
                    (fill
                        (type none)
                    )
                )
            )
            (symbol "R_1_1"
                (pin passive line
                    (at 0 3.81 270)
                    (length 1.27)
                    (name "~"
                        (effects
                            (font
                                (size 1.27 1.27)
                            )
                        )
                    )
                    (number "1"
                        (effects
                            (font
                                (size 1.27 1.27)
                            )
                        )
                    )
                )
                (pin passive line
                    (at 0 -3.81 90)
                    (length 1.27)
                    (name "~"
                        (effects
                            (font
                                (size 1.27 1.27)
                            )
                        )
                    )
                    (number "2"
                        (effects
                            (font
                                (size 1.27 1.27)
                            )
                        )
                    )
                )
            )
            (embedded_fonts no)
        )
    )
    (symbol
        (lib_id "Device:R")
        (at 95.25 73.66 0)
        (unit 1)
        (exclude_from_sim no)
        (in_bom yes)
        (on_board yes)
        (dnp no)
        (fields_autoplaced yes)
        (uuid "3bb4d371-5882-4297-84fd-b4e30f862291")
        (property "Reference" "R?"
            (at 97.79 72.3899 0)
            (effects
                (font
                    (size 1.27 1.27)
                )
                (justify left)
            )
        )
        (property "Value" "R"
            (at 97.79 74.9299 0)
            (effects
                (font
                    (size 1.27 1.27)
                )
                (justify left)
            )
        )
        (property "Footprint" ""
            (at 93.472 73.66 90)
            (effects
                (font
                    (size 1.27 1.27)
                )
                (hide yes)
            )
        )
        (property "Datasheet" "~"
            (at 95.25 73.66 0)
            (effects
                (font
                    (size 1.27 1.27)
                )
                (hide yes)
            )
        )
        (property "Description" "Resistor"
            (at 95.25 73.66 0)
            (effects
                (font
                    (size 1.27 1.27)
                )
                (hide yes)
            )
        )
        (pin "1"
            (uuid "8d57597d-9144-40ce-9745-fa1d610e7ae0")
        )
        (pin "2"
            (uuid "b70facae-ae80-40c4-97af-f37b215a794c")
        )
        (instances
            (project ""
                (path "/7581b6ee-fd20-4dd8-85dd-91c70d13dcc0"
                    (reference "R?")
                    (unit 1)
                )
            )
        )
    )
    (sheet_instances
        (path "/"
            (page "1")
        )
    )
    (embedded_fonts no)
)`

  const [parsed] = SxClass.parse(input)
  expect(parsed).toBeInstanceOf(KicadSch)

  const schematic = parsed as KicadSch
  const output = schematic.getString()

  // Parse the output again to ensure it's valid
  const [reparsed] = SxClass.parse(output)
  expect(reparsed).toBeInstanceOf(KicadSch)

  // Basic structure checks
  expect(schematic.version).toBe(20250114)
  expect(schematic.generator).toBe("eeschema")
  expect(schematic.symbols).toHaveLength(1)
  expect(schematic.symbols[0]?.libraryId).toBe("Device:R")
})
