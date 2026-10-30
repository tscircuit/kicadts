import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import {
  parseKicadSch,
  resolveSchematicNets,
  type SchematicNetResolution,
} from "../../lib"
import nativeNets from "../assets/schematic-connectivity/native-nets.json"

const pinMembership = ({ nets }: SchematicNetResolution) =>
  nets
    .filter((net) => net.pins.length > 0)
    .map((net) =>
      net.pins
        .map(({ symbol, pin }) => {
          const reference = symbol.properties.find(
            (p) => p.key === "Reference",
          )?.value
          return `${reference}.${pin.numberString}`
        })
        .sort(),
    )
    .sort((a, b) => a.join().localeCompare(b.join()))

// Expected pin memberships were exported with KiCad 10.0.7, independently of
// this resolver. The test suite does not require a native KiCad installation.
for (const [filename, expected] of Object.entries(nativeNets)) {
  test(`matches native KiCad connectivity: ${filename}`, () => {
    const content = readFileSync(
      new URL(`../assets/schematic-connectivity/${filename}`, import.meta.url),
      "utf8",
    )
    const schematic = parseKicadSch(content)
    const before = schematic.getString()
    const result = resolveSchematicNets(schematic)
    expect(pinMembership(result)).toEqual(expected)
    expect(result.warnings).toEqual([])
    expect(schematic.getString()).toBe(before)
    expect(resolveSchematicNets(schematic)).toEqual(result)
  })
}

const pin = (
  number: string,
  x = 0,
  y = 0,
  type = "passive",
  name = number,
  hidden = false,
) =>
  `(pin ${type} line (at ${x} ${y} 0) (length 2.54) ${hidden ? "hide" : ""} (name "${name}") (number "${number}"))`
const library = (id: string, pins: string, power = false) =>
  `(symbol "${id}" ${power ? "(power)" : ""} (symbol "${id.split(":")[1]}_1_1" ${pins}))`
const instance = (
  id: string,
  reference: string,
  x: number,
  y: number,
  extra = "",
  value = reference,
) =>
  `(symbol (lib_id "${id}") (at ${x} ${y} 0) (unit 1) ${extra} (property "Reference" "${reference}") (property "Value" "${value}"))`
const wire = (x1: number, y1: number, x2: number, y2: number) =>
  `(wire (pts (xy ${x1} ${y1}) (xy ${x2} ${y2})))`
const label = (name: string, x: number, y: number, global = false) =>
  `(${global ? "global_label" : "label"} "${name}" (at ${x} ${y} 0))`
const schematic = (definitions: string, contents: string) =>
  parseKicadSch(
    `(kicad_sch (version 20250114) (generator "kicadts-test") (lib_symbols ${definitions}) ${contents})`,
  )

test("returns original wires, pins, labels and junctions grouped by net", () => {
  const sch = schematic(
    library("Test:Terminal", pin("1")),
    `
    ${instance("Test:Terminal", "J1", 10, 20)}
    ${instance("Test:Terminal", "J2", 30, 20)}
    ${instance("Test:Terminal", "J3", 20, 10)}
    ${wire(10, 20, 30, 20)} ${wire(20, 10, 20, 20)}
    (junction (at 20 20) (diameter 0)) ${label("SIGNAL", 10, 20)}`,
  )
  const result = resolveSchematicNets(sch)
  expect(result.nets).toHaveLength(1)
  const net = result.nets[0]!
  expect(net.id).toBe("net_0")
  expect(net.names).toEqual(["SIGNAL"])
  expect(net.wires).toEqual(sch.wires)
  expect(net.wires[0]).toBe(sch.wires[0])
  expect(net.labels[0]).toBe(sch.labels[0])
  expect(net.junctions[0]).toBe(sch.junctions[0])
  expect(net.pins.map(({ symbol }) => symbol)).toEqual(sch.symbols)
  expect(
    net.pins.every(
      ({ pin }) => pin === sch.libSymbols!.symbols[0]!.subSymbols[0]!.pins[0],
    ),
  ).toBe(true)
})

test("local and global labels connect remote paths, including aliases", () => {
  const result = resolveSchematicNets(
    schematic(
      "",
      `
    ${wire(0, 0, 10, 0)} ${label("COL3", 0, 0)}
    ${wire(20, 0, 30, 0)} ${label("COL3", 20, 0, true)}
    ${label("COL{slash}3", 30, 0)}
    ${wire(40, 0, 50, 0)} ${label("COL{slash}3", 40, 0)}
    ${wire(60, 0, 70, 0)} ${label("COL4", 60, 0)}`,
    ),
  )
  expect(result.nets).toHaveLength(2)
  expect(result.nets[0]!.wires).toHaveLength(3)
  expect(result.nets[0]!.names).toEqual(["COL3", "COL/3"])
  expect(result.nets[1]!.names).toEqual(["COL4"])
})

test("power symbols and hidden power inputs connect; visible inputs and flags do not", () => {
  const definitions = [
    library("Custom:GND", pin("1", 0, 0, "power_in", "GND"), true),
    library("Custom:PWR_FLAG", pin("1", 0, 0, "power_out", "pwr"), true),
    library("Test:Hidden", pin("1", 0, 0, "power_in", "VCC", true)),
    library("Test:Visible", pin("1", 0, 0, "power_in", "VCC")),
  ].join("\n")
  const result = resolveSchematicNets(
    schematic(
      definitions,
      `
    ${instance("Custom:GND", "#PWR1", 0, 0, "", "GND")}
    ${instance("Custom:GND", "#PWR2", 10, 0, "", "GND")}
    ${instance("Custom:PWR_FLAG", "#FLG1", 20, 0, "", "PWR_FLAG")}
    ${instance("Custom:PWR_FLAG", "#FLG2", 30, 0, "", "PWR_FLAG")}
    ${instance("Test:Hidden", "U1", 40, 0)}
    ${instance("Test:Hidden", "U2", 50, 0)}
    ${instance("Test:Visible", "U3", 60, 0)}`,
    ),
  )
  expect(result.nets).toHaveLength(5)
  expect(result.nets.find((n) => n.names.includes("GND"))!.pins).toHaveLength(2)
  expect(result.nets.find((n) => n.names.includes("VCC"))!.pins).toHaveLength(2)
  expect(result.nets.filter((n) => n.names.length === 0)).toHaveLength(3)
})

for (const [angle, mirror, x, y] of [
  [0, undefined, 33.02, 25.4],
  [90, undefined, 25.4, 27.94],
  [180, undefined, 27.94, 35.56],
  [270, undefined, 35.56, 33.02],
  [90, "x", 25.4, 33.02],
  [90, "y", 35.56, 27.94],
] as const) {
  test(`pin placement at ${angle} degrees, mirror ${mirror ?? "none"}`, () => {
    const sch = schematic(
      library("Test:Offset", pin("1", 2.54, 5.08)),
      instance("Test:Offset", "U1", 30.48, 30.48),
    )
    sch.symbols[0]!.at!.angle = angle
    sch.symbols[0]!.mirror = mirror
    sch.wires = parseKicadSch(`(kicad_sch ${wire(x, y, x + 10, y)})`).wires
    const result = resolveSchematicNets(sch)
    expect(result.nets).toHaveLength(1)
    expect(result.nets[0]!.pins[0]!.position).toEqual({ x, y })
    expect(result.nets[0]!.wires).toHaveLength(1)
  })
}

test("only selected units and body styles contribute pins, including common pins", () => {
  const definition = `(symbol "Test:Multi"
    (symbol "Multi_0_0" ${pin("C")})
    (symbol "Multi_1_1" ${pin("A", 2.54, 0)})
    (symbol "Multi_2_1" ${pin("B", 0, 2.54)})
    (symbol "Multi_1_2" ${pin("D", 5.08, 0)}))`
  const sch = schematic(definition, instance("Test:Multi", "U1", 10, 10))
  expect(
    resolveSchematicNets(sch).nets.flatMap((n) =>
      n.pins.map((p) => p.pin.numberString),
    ),
  ).toEqual(["C", "A"])
  sch.symbols[0]!.unit = 2
  expect(
    resolveSchematicNets(sch).nets.flatMap((n) =>
      n.pins.map((p) => p.pin.numberString),
    ),
  ).toEqual(["C", "B"])
  sch.symbols[0]!.unit = 1
  sch.symbols[0]!.bodyStyle = 2
  expect(
    resolveSchematicNets(sch).nets.flatMap((n) =>
      n.pins.map((p) => p.pin.numberString),
    ),
  ).toEqual(["C", "D"])
})

test("retains no-connect markers and intrinsic no-connect pin types", () => {
  const result = resolveSchematicNets(
    schematic(
      library("Test:Terminal", pin("1")) +
        library("Test:NC", pin("1", 0, 0, "no_connect")),
      `${instance("Test:Terminal", "J1", 10, 10)}
     ${instance("Test:Terminal", "J2", 20, 10)}
     ${instance("Test:NC", "J3", 30, 10)}
     (no_connect (at 10 10))`,
    ),
  )
  expect(result.nets.flatMap((n) => n.pins.map((p) => p.isNoConnect))).toEqual([
    true,
    false,
    true,
  ])
})

test("diagonal attachment uses the nanometer grid without snapping nearby labels", () => {
  const result = resolveSchematicNets(
    schematic(
      "",
      `
    ${wire(0, 0, 1000, 1000)}
    ${label("ON", 500, 500)} ${label("OFF", 500, 500.000001)}`,
    ),
  )
  expect(result.nets).toHaveLength(2)
  expect(result.nets[0]!.names).toEqual(["ON"])
  expect(result.nets[0]!.wires).toHaveLength(1)
  expect(result.nets[1]!.names).toEqual(["OFF"])
  expect(result.nets[1]!.wires).toHaveLength(0)
})

test("warns when library geometry or child sheets are unavailable", () => {
  const sch = parseKicadSch(`(kicad_sch
    (symbol (lib_id "Missing:Part") (at 0 0 0))
    (sheet (at 20 20) (size 10 10)))`)
  const result = resolveSchematicNets(sch)
  expect(result.nets).toHaveLength(0)
  expect(result.warnings).toHaveLength(2)
  expect(result.warnings[0]).toContain("Child sheets")
  expect(result.warnings[1]).toContain("Missing:Part")
})

test("an empty schematic has no nets or warnings", () => {
  expect(resolveSchematicNets(schematic("", ""))).toEqual({
    nets: [],
    warnings: [],
  })
})
