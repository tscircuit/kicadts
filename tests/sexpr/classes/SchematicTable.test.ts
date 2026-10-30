import { expect, test } from "bun:test"
import {
  KicadSch,
  parseKicadSch,
  SchematicTable,
  SchematicTextBox,
  Stroke,
  TableBorder,
  TableCell,
  TableCellMargins,
  TableCellSpan,
  TableSeparators,
  TableCellFill,
  TableCellSize,
  TextBoxSize,
  TextEffects,
} from "lib/sexpr"

const parseTable = (content: string) =>
  parseKicadSch(`(kicad_sch (table ${content}))`).tables[0]!

test("schematic tables can be constructed, edited, and repeated", () => {
  const borderStroke = new Stroke()
  borderStroke.width = 0.2
  borderStroke.type = "solid"
  const table = new SchematicTable({
    columnCount: 2,
    columnWidths: [10, 20],
    rowHeights: [5, 6],
    border: new TableBorder({
      external: false,
      header: true,
      stroke: borderStroke,
    }),
    separators: new TableSeparators({ rows: true, columns: false }),
    cells: [
      new TableCell({
        text: 'A "quoted" (cell)\\path\nnext',
        excludeFromSim: true,
        at: { x: 15, y: 25, angle: 90 },
        size: { width: 30, height: 5 },
        margins: new TableCellMargins(1, 2, 3, 4),
        span: new TableCellSpan(2, 1),
        effects: TextEffects.fromSexprPrimitives([
          ["font", ["size", 1.27, 1.27]],
        ]),
        stroke: borderStroke,
        fill: TableCellFill.fromSexprPrimitives([["type", "none"]]),
        uuid: "00000000-0000-0000-0000-000000000001",
        locked: true,
      }),
      new TableCell({ text: "", span: new TableCellSpan(0, 0) }),
      new TableCell({ text: "C" }),
      new TableCell({ text: "D" }),
    ],
    uuid: "00000000-0000-0000-0000-000000000002",
    locked: false,
  })
  const schematic = new KicadSch({ tables: [table, table] })
  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.tables).toHaveLength(2)
  expect(reparsed.getString()).toBe(schematic.getString())
  const result = reparsed.tables[0]!
  expect(result.columnWidths).toEqual([10, 20])
  expect(result.rowHeights).toEqual([5, 6])
  expect(result.border?.external).toBe(false)
  expect(result.separators?.columns).toBe(false)
  expect(result.uuid?.value).toBe(table.uuid?.value)
  expect(result.locked).toBe(false)
  expect(result.cells.map((cell) => cell.text)).toEqual(
    table.cells.map((cell) => cell.text),
  )
  expect(result.cells[0]?.excludeFromSim).toBe(true)
  expect(result.cells[0]?.locked).toBe(true)
  expect(result.cells[0]?.at?.angle).toBe(90)
  expect(result.cells[0]?.size).toBeInstanceOf(TableCellSize)
  expect(result.cells[0]?.fill).toBeInstanceOf(TableCellFill)
  expect(result.cells[1]?.span).toMatchObject({ columns: 0, rows: 0 })

  result.border!.external = true
  result.border!.header = false
  result.separators!.columns = true
  result.separators!.rows = false
  result.cells[0]!.text = "edited"
  result.columnCount = 1
  result.columnWidths = [30]
  result.rowHeights = [11]
  result.cells = [result.cells[0]!]
  const edited = parseKicadSch(new KicadSch({ tables: [result] }).getString())
    .tables[0]!
  expect(edited.border?.external).toBe(true)
  expect(edited.border?.header).toBe(false)
  expect(edited.separators?.columns).toBe(true)
  expect(edited.separators?.rows).toBe(false)
  expect(edited.columnCount).toBe(1)
  expect(edited.cells[0]?.text).toBe("edited")
})

test("table cell size and fill registrations preserve text box parsing", () => {
  const schematic = parseKicadSch(`(kicad_sch
    (table (cells (table_cell "cell" (size 10 5) (fill (type none)))))
    (text_box "box" (size 20 10) (fill (type none)))
  )`)
  expect(schematic.tables[0]?.cells[0]?.size).toBeInstanceOf(TableCellSize)
  expect(schematic.textBoxes[0]).toBeInstanceOf(SchematicTextBox)
  expect(
    schematic.textBoxes[0]
      ?.getChildren()
      .find((child) => child.token === "size"),
  ).toBeInstanceOf(TextBoxSize)
  expect(
    schematic.textBoxes[0]
      ?.getChildren()
      .find((child) => child.token === "size"),
  ).not.toBeInstanceOf(TableCellSize)
})

test("table parsing accepts unordered children and preserves cell order", () => {
  const table = parseTable(`
    (cells (table_cell "first") (table_cell "second") (table_cell "third"))
    (row_heights 5) (column_widths 10 20 30) (column_count 3)
    (separators (cols no) (rows yes)) (border (header no) (external yes))
  `)
  expect(table.cells.map((cell) => cell.text)).toEqual([
    "first",
    "second",
    "third",
  ])
  expect(table.getChildren().map((child) => child.token)).toEqual([
    "column_count",
    "border",
    "separators",
    "column_widths",
    "row_heights",
    "cells",
  ])
})

test.each([
  "(column_count 0)",
  "(column_count 1.5)",
  "(column_count 1 2)",
  "(column_widths invalid)",
  "(row_heights invalid)",
  '(cells (table_cell "A" (margins 1 2 3)))',
  '(cells (table_cell "A" (span 1)))',
  '(cells (table_cell "A" (span invalid 1)))',
  "(stroke (width 0.1))",
  "(border (width 1))",
  "(separators (header yes))",
  '(cells (text "invalid"))',
  "(unknown_table_child 1)",
  "invalid",
])("rejects invalid table data: %s", (content) => {
  expect(() => parseTable(content)).toThrow()
})

test.each([
  "(column_count 1) (column_count 2)",
  "(cells) (cells)",
  "(border (external yes) (external no))",
  "(separators (rows yes) (rows no))",
  '(cells (table_cell "A" (at 0 0) (at 1 1)))',
])("rejects duplicate table properties: %s", (content) => {
  expect(() => parseTable(content)).toThrow(/repeated child token/)
})

test("SparkFun address table exposes typed cells and layout", async () => {
  const original = await Bun.file(
    "tests/assets/SparkFun_Qwiic_Current_Sensor_INA2XX.kicad_sch",
  ).text()
  const schematic = parseKicadSch(original)
  expect(schematic.tables).toHaveLength(1)
  const table = schematic.tables[0]!
  expect(table).toBeInstanceOf(SchematicTable)
  expect(table.columnCount).toBe(3)
  expect(table.columnWidths).toEqual([9.144, 9.398, 7.366])
  expect(table.rowHeights).toEqual([2.794, 2.794, 2.794, 2.794, 2.794])
  expect(table.border?.external).toBe(true)
  expect(table.border?.header).toBe(true)
  expect(table.border?.stroke?.color).toEqual({ r: 72, g: 72, b: 72, a: 1 })
  expect(table.separators?.rows).toBe(true)
  expect(table.separators?.columns).toBe(true)
  expect(table.cells.map((cell) => cell.text)).toEqual([
    "A1",
    "A0",
    "ADDR",
    "CLOSED",
    "CLOSED",
    "0x40",
    "CLOSED",
    "OPEN",
    "0x41",
    "OPEN",
    "CLOSED",
    "0x44",
    "OPEN",
    "OPEN",
    "0x45",
  ])
  const cell = table.cells[0]!
  expect(cell).toBeInstanceOf(TableCell)
  expect(cell.size).toBeInstanceOf(TableCellSize)
  expect(cell.fill).toBeInstanceOf(TableCellFill)
  expect(cell.at?.x).toBe(204.724)
  expect(cell.size?.width).toBe(9.144)
  expect(cell.margins).toMatchObject({
    left: 0.9525,
    top: 0.9525,
    right: 0.9525,
    bottom: 0.9525,
  })
  expect(cell.span).toMatchObject({ columns: 1, rows: 1 })
  expect(cell.effects?.justify?.horizontal).toBe("left")
  expect(cell.effects?.justify?.vertical).toBe("top")
  expect(cell.uuid?.value).toBe("7a591b8b-5537-4a04-93da-473dc62ec0eb")
})
