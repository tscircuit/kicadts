import { expect, test } from "bun:test"
import {
  ExcludeFromSim,
  FieldsAutoplaced,
  GlobalLabel,
  HierarchicalLabel,
  HierarchicalLabelShape,
  type HierarchicalLabelShapeString,
  KicadSch,
  parseKicadSch,
  Property,
  SxClass,
  TextEffects,
  Uuid,
} from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"
import { expectEqualPrimitiveSExpr } from "../../fixtures/expectEqualPrimitiveSExpr"

test("hierarchical labels preserve shapes, positions, fields, and text effects", () => {
  const source = `(kicad_sch
    (hierarchical_label "~{ENABLE}"
      (shape output)
      (at 10.16 20.32 270)
      (fields_autoplaced yes)
      (effects (font (size 1.27 1.27) (bold yes)) (justify right))
      (uuid "12345678-1234-1234-1234-123456789abc")
      (exclude_from_sim yes)
      (property "Netclass" "Signals" (at 10 21 0))
      (property "Description" "Enable output" (at 10 22 0))))`
  const schematic = parseKicadSch(source)
  const [label] = schematic.hierarchicalLabels
  expect(label).toBeInstanceOf(HierarchicalLabel)
  expect(label).not.toBeInstanceOf(GlobalLabel)
  expect(label!.value).toBe("~{ENABLE}")
  expect(label!.shape).toBe("output")
  expect(label!.at).toMatchObject({ x: 10.16, y: 20.32, angle: 270 })
  expect(label!.effects).toBeInstanceOf(TextEffects)
  expect(label!.uuid!.value).toBe("12345678-1234-1234-1234-123456789abc")
  expect(label!.fieldsAutoplaced).toBe(true)
  expect(label!.excludeFromSim).toBe(true)
  expect(label!.properties.map((property) => property.key)).toEqual([
    "Netclass",
    "Description",
  ])
  expectEqualPrimitiveSExpr(
    parseToPrimitiveSExpr(schematic.getString()),
    parseToPrimitiveSExpr(source),
  )
})

test.each<HierarchicalLabelShapeString>([
  "input",
  "output",
  "bidirectional",
  "tri_state",
  "passive",
])("hierarchical labels support the %s shape", (shape) => {
  const schematic = parseKicadSch(
    `(kicad_sch (hierarchical_label "SIGNAL" (shape ${shape})))`,
  )
  expect(schematic.hierarchicalLabels[0]!.shape).toBe(shape)
  expect(schematic.hierarchicalLabels[0]!.getChildren()[0]).toBeInstanceOf(
    HierarchicalLabelShape,
  )
  expect(
    parseKicadSch(schematic.getString()).hierarchicalLabels[0]!.shape,
  ).toBe(shape)
})

test("multiple hierarchical labels remain distinct from local and global labels", () => {
  const schematic = parseKicadSch(`(kicad_sch
    (label "LOCAL")
    (global_label "GLOBAL" (shape passive))
    (hierarchical_label "FIRST" (shape input))
    (hierarchical_label "SECOND" (shape output)))`)
  expect(schematic.labels.map((label) => label.value)).toEqual(["LOCAL"])
  expect(schematic.globalLabels.map((label) => label.value)).toEqual(["GLOBAL"])
  expect(schematic.hierarchicalLabels.map((label) => label.value)).toEqual([
    "FIRST",
    "SECOND",
  ])
  expect(parseKicadSch(schematic.getString()).getString()).toBe(
    schematic.getString(),
  )
  const shape = SxClass.parsePrimitiveSexpr(["shape", "input"], {
    parentToken: "hierarchical_label",
  })
  expect(shape).toBeInstanceOf(HierarchicalLabelShape)
  expect(() =>
    SxClass.parsePrimitiveSexpr(["shape", "input"], {
      parentToken: "symbol",
    }),
  ).toThrow()
})

test("hierarchical labels support construction, editing, and copied collections", () => {
  const properties = [new Property({ key: "Netclass", value: "Signals" })]
  const label = new HierarchicalLabel({
    value: "DATA[0..7]",
    shape: "bidirectional",
    at: { x: 12.7, y: 25.4, angle: 90 },
    effects: new TextEffects(),
    uuid: new Uuid("11111111-1111-4111-8111-111111111111"),
    fieldsAutoplaced: new FieldsAutoplaced(true),
    excludeFromSim: new ExcludeFromSim(true),
    properties,
  })
  properties.length = 0
  label.properties.length = 0
  expect(label.properties).toHaveLength(1)

  label.value = 'A "quoted"\\path\n~{RESET}'
  label.shape = "tri_state"
  label.at = { x: 1, y: 2, angle: 180 }
  label.fieldsAutoplaced = false
  label.excludeFromSim = false
  label.uuid = "22222222-2222-4222-8222-222222222222"
  const labels = [label]
  const schematic = new KicadSch({ hierarchicalLabels: labels })
  labels.length = 0
  schematic.hierarchicalLabels.length = 0
  expect(schematic.hierarchicalLabels).toHaveLength(1)

  const [reparsed] = parseKicadSch(schematic.getString()).hierarchicalLabels
  expect(reparsed!.value).toBe(label.value)
  expect(reparsed!.shape).toBe("tri_state")
  expect(reparsed!.at).toMatchObject({ x: 1, y: 2, angle: 180 })
  expect(reparsed!.fieldsAutoplaced).toBe(false)
  expect(reparsed!.excludeFromSim).toBe(false)
  expect(reparsed!.uuid!.value).toBe("22222222-2222-4222-8222-222222222222")
  expect(reparsed!.properties).toHaveLength(1)
  label.at = undefined
  label.uuid = undefined
  label.effects = undefined
  label.properties = []
  expect(
    label.getString(),
  ).toBe(`(hierarchical_label "A \\"quoted\\"\\\\path\\n~{RESET}"
  (shape tri_state)
  (fields_autoplaced no)
  (exclude_from_sim no)
)`)
})

test("hierarchical labels have useful defaults and preserve string values", () => {
  const label = new HierarchicalLabel()
  expect(label.shape).toBe("input")
  expect(label.fieldsAutoplaced).toBe(false)
  expect(label.excludeFromSim).toBe(false)
  for (const value of ["", "0", "nil", "#t", "A B", "{I^{2}C0}"]) {
    label.value = value
    expect(
      parseKicadSch(new KicadSch({ hierarchicalLabels: [label] }).getString())
        .hierarchicalLabels[0]!.value,
    ).toBe(value)
  }
})

test.each([
  ["(fields_autoplaced yes)", true],
  ["(fields_autoplaced no)", false],
] as const)("hierarchical labels support %s", (flag, expected) => {
  const source = `(kicad_sch (hierarchical_label "SIGNAL" (shape input) ${flag}))`
  const schematic = parseKicadSch(source)
  expect(schematic.hierarchicalLabels[0]!.fieldsAutoplaced).toBe(expected)
  expect(
    parseKicadSch(schematic.getString()).hierarchicalLabels[0]!
      .fieldsAutoplaced,
  ).toBe(expected)
})

test.each([
  "(hierarchical_label)",
  "(hierarchical_label 123)",
  "(hierarchical_label #t)",
  "(hierarchical_label nil)",
  '(hierarchical_label "SIGNAL" "extra")',
  '(hierarchical_label "SIGNAL" ())',
  '(hierarchical_label "SIGNAL" (shape))',
  '(hierarchical_label "SIGNAL" (shape input output))',
  '(hierarchical_label "SIGNAL" (shape 123))',
  '(hierarchical_label "SIGNAL" (shape unknown))',
  '(hierarchical_label "SIGNAL" (stroke (width 0)))',
  '(hierarchical_label "SIGNAL" (unknown))',
])(
  "hierarchical labels reject malformed or unsupported syntax: %s",
  (source) => {
    expect(() => parseKicadSch(`(kicad_sch ${source})`)).toThrow()
  },
)

test.each([
  "(shape input)",
  "(at 0 0 0)",
  "(effects (font (size 1 1)))",
  '(uuid "11111111-1111-4111-8111-111111111111")',
  "(fields_autoplaced yes)",
  "(exclude_from_sim no)",
])("hierarchical labels reject duplicate singleton children: %s", (child) => {
  expect(() =>
    parseKicadSch(
      `(kicad_sch (hierarchical_label "SIGNAL" ${child} ${child}))`,
    ),
  ).toThrow(/repeated child token/)
})
