import { expect, test } from "bun:test"

const api: typeof import("../../../lib/index") = await import(
  process.env.PLACEMENT_TEST_ENTRY === "built"
    ? "../../../dist/index.js"
    : "../../../lib/index.ts"
)

// KiCad 10.0.5's placement parser sets one source type/value in input order:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L8163-L8217
// Its writer emits the selected source, quoted, at lines 2952-2983 of
// pcb_io_kicad_sexpr.cpp. These full-board variants are synthetic, not native
// exports. The existing board and its golden snapshots remain unchanged.
const original = await Bun.file("tests/assets/keepout.kicad_pcb").text()
const originalPlacement =
  '(placement\n\t\t\t(enabled no)\n\t\t\t(sheetname "")\n\t\t)'
expect(original.split(originalPlacement)).toHaveLength(2)

function boardWith(placement: string) {
  return api.parseKicadPcb(original.replace(originalPlacement, placement))
}

function placementFrom(placement: string) {
  const board = boardWith(placement)
  expect(board.zones).toHaveLength(1)
  expect(board.zones[0]!.keepout!.tracks).toBe("not_allowed")
  return { board, placement: board.zones[0]!.placement! }
}

test("original sheetname placement preserves disabled and empty values", () => {
  const board = api.parseKicadPcb(original)
  const placement = board.zones[0]!.placement!
  expect(placement.sheetname).toBe("")
  expect(placement.enabled).toBe(false)
  const again = api.parseKicadPcb(board.getString()).zones[0]!.placement!
  expect(again.sheetname).toBe("")
  expect(again.enabled).toBe(false)
})

for (const [token, property, name] of [
  ["component_class", "componentClass", "Analog Front End"],
  ["group", "group", "Channel A"],
] as const) {
  for (const enabled of [true, false, undefined]) {
    test(`${token} placement round-trips with enabled=${enabled}`, () => {
      const enabledText =
        enabled === undefined ? "" : `(enabled ${enabled ? "yes" : "no"})`
      const { board, placement } = placementFrom(
        `(placement ${enabledText} (${token} "${name}"))`,
      )
      expect(placement.enabled).toBe(enabled)
      expect(placement[property]).toBe(name)
      expect(placement.sheetname).toBeUndefined()
      expect(placement.getChildren().map((child) => child.token)).toEqual(
        enabled === undefined ? [token] : ["enabled", token],
      )
      const again = api.parseKicadPcb(board.getString()).zones[0]!.placement!
      expect(again[property]).toBe(name)
      expect(again.enabled).toBe(enabled)
      placement[property] = `${name} edited`
      expect(
        api.parseKicadPcb(board.getString()).zones[0]!.placement![property],
      ).toBe(`${name} edited`)
    })
  }
}

test("source and enabled may both be omitted without inventing a value", () => {
  for (const text of ["(placement)", "(placement (enabled yes))"]) {
    const { board, placement } = placementFrom(text)
    expect(placement.sheetname).toBeUndefined()
    expect(placement.componentClass).toBeUndefined()
    expect(placement.group).toBeUndefined()
    expect(
      placement.getChildren().filter((child) => child.token !== "enabled"),
    ).toHaveLength(0)
    expect(
      api.parseKicadPcb(board.getString()).zones[0]!.placement!.getString(),
    ).toBe(placement.getString())
  }
})

const sourceCases = [
  ['(sheetname "S") (component_class "C") (group "G")', "group", "G"],
  ['(sheetname "S") (group "G") (component_class "C")', "componentClass", "C"],
  ['(component_class "C") (sheetname "S") (group "G")', "group", "G"],
  ['(component_class "C") (group "G") (sheetname "S")', "sheetname", "S"],
  ['(group "G") (sheetname "S") (component_class "C")', "componentClass", "C"],
  ['(group "G") (component_class "C") (sheetname "S")', "sheetname", "S"],
] as const

test("mixed source alternatives use the last source in every input order", () => {
  for (const [sources, property, expected] of sourceCases) {
    const { board, placement } = placementFrom(`(placement ${sources})`)
    expect(placement[property]).toBe(expected)
    expect(placement.getChildren()).toHaveLength(1)
    for (const other of ["sheetname", "componentClass", "group"] as const) {
      if (other !== property) expect(placement[other]).toBeUndefined()
    }
    const again = api.parseKicadPcb(board.getString()).zones[0]!.placement!
    expect(again[property]).toBe(expected)
    expect(again.getChildren()).toHaveLength(1)
  }
})

test("repeated same-kind sources use their last value", () => {
  for (const [token, property] of [
    ["sheetname", "sheetname"],
    ["component_class", "componentClass"],
    ["group", "group"],
  ] as const) {
    const { board, placement } = placementFrom(
      `(placement (${token} "first") (${token} "last"))`,
    )
    expect(placement[property]).toBe("last")
    expect(placement.getChildren()).toHaveLength(1)
    expect(
      api.parseKicadPcb(board.getString()).zones[0]!.placement![property],
    ).toBe("last")
  }
})

test("enabled updates independently in input order, before or after sources", () => {
  const { board, placement } = placementFrom(
    '(placement (enabled no) (group "G") (enabled yes) (component_class "C") (enabled no))',
  )
  expect(placement.componentClass).toBe("C")
  expect(placement.group).toBeUndefined()
  expect(placement.enabled).toBe(false)
  expect(placement.getChildren().map((child) => child.token)).toEqual([
    "enabled",
    "component_class",
  ])
  const again = api.parseKicadPcb(board.getString()).zones[0]!.placement!
  expect(again.enabled).toBe(false)
  expect(again.componentClass).toBe("C")
  const lastYes = boardWith(
    '(placement (enabled no) (sheetname "S") (enabled yes))',
  )
  expect(lastYes.zones[0]!.placement!.enabled).toBe(true)
  expect(
    api.parseKicadPcb(lastYes.getString()).zones[0]!.placement!.enabled,
  ).toBe(true)
})

for (const [token, property] of [
  ["component_class", "componentClass"],
  ["group", "group"],
] as const) {
  test(`${token} preserves empty, escaped and numeric-looking source names`, () => {
    for (const [name, quoted] of [
      ["", '""'],
      ["001", '"001"'],
      ["1e3", '"1e3"'],
      ["#t", '"#t"'],
      ["nil", '"nil"'],
      ['A "quoted"\\path\nnext', '"A \\"quoted\\"\\\\path\\nnext"'],
    ]) {
      const { board, placement } = placementFrom(
        `(placement (${token} ${quoted}))`,
      )
      expect(placement[property]).toBe(name)
      expect(placement.getChildren()[0]!.getString()).toBe(
        `(${token} ${quoted})`,
      )
      expect(
        api.parseKicadPcb(board.getString()).zones[0]!.placement![property],
      ).toBe(name)
    }
  })
}

test("setters select one source and clearing an inactive kind preserves it", () => {
  const { board, placement } = placementFrom(
    '(placement (sheetname "S") (enabled no))',
  )
  placement.group = "G"
  expect(placement.sheetname).toBeUndefined()
  placement.componentClass = "C"
  expect(placement.group).toBeUndefined()
  placement.group = undefined
  placement.sheetname = undefined
  expect(placement.componentClass).toBe("C")
  expect(
    api.parseKicadPcb(board.getString()).zones[0]!.placement!.componentClass,
  ).toBe("C")
  placement.componentClass = undefined
  expect(placement.getChildren().map((child) => child.token)).toEqual([
    "enabled",
  ])
  placement.enabled = undefined
  expect(placement.getString()).toBe("(placement)")
  placement.componentClass = "C2"
  placement.sheetname = "S2"
  expect(placement.componentClass).toBeUndefined()
  expect(
    api.parseKicadPcb(board.getString()).zones[0]!.placement!.sheetname,
  ).toBe("S2")
  placement.sheetname = undefined
  expect(placement.getString()).toBe("(placement)")
  placement.group = "G2"
  placement.group = undefined
  expect(placement.getString()).toBe("(placement)")
  expect(
    api.parseKicadPcb(board.getString()).zones[0]!.placement!.getChildren(),
  ).toHaveLength(0)
})

test("exported source classes work with factories and wrapper setters", () => {
  expect(api.ZonePlacementComponentClass).toBeFunction()
  expect(api.ZonePlacementGroup).toBeFunction()
  const component = api.ZonePlacementComponentClass.fromSexprPrimitives(["C"])
  const group = api.ZonePlacementGroup.fromSexprPrimitives(["G"])
  const placement = new api.ZonePlacement()
  placement.componentClass = component
  expect(placement.getChildren()[0]).toBe(component)
  placement.group = group
  expect(placement.getChildren()[0]).toBe(group)
  expect(placement.componentClass).toBeUndefined()
  placement.sheetname = new api.ZonePlacementSheetname("S")
  expect(placement.group).toBeUndefined()
  placement.enabled = new api.ZonePlacementEnabled(false)
  const { placement: reparsed } = placementFrom(placement.getString())
  expect(reparsed.sheetname).toBe("S")
  expect(reparsed.enabled).toBe(false)
})

for (const token of ["component_class", "group"]) {
  test(`${token} rejects malformed source arguments without dropping them`, () => {
    for (const args of ["", "1", "#t", "nil", '"A" "B"', "(uuid x)"]) {
      expect(() => boardWith(`(placement (${token} ${args}))`)).toThrow()
    }
  })
}

test("placement rejects stray primitives and unsupported children, even before a valid source", () => {
  for (const child of [
    "rogue",
    "1",
    "()",
    "(width 1)",
    '(unknown_source "X")',
  ]) {
    expect(() => boardWith(`(placement ${child} (sheetname "S"))`)).toThrow()
  }
  expect(() =>
    boardWith('(placement (unknown_source "X") (group "G"))'),
  ).toThrow()
})

test("board and footprint groups retain their own class and member metadata", () => {
  const groupText =
    '(group "BoardGroup" (uuid "11111111-1111-4111-8111-111111111111") (members "22222222-2222-4222-8222-222222222222"))'
  const boardText = original.trimEnd().replace(/\)$/, `${groupText}\n)`)
  const board = api.parseKicadPcb(boardText)
  const group = board.getChildren().find((child) => child.token === "group")!
  expect(group).toBeInstanceOf(api.Group)
  expect((group as InstanceType<typeof api.Group>).name).toBe("BoardGroup")
  expect((group as InstanceType<typeof api.Group>).members).toEqual([
    "22222222-2222-4222-8222-222222222222",
  ])
  expect(
    api
      .parseKicadPcb(board.getString())
      .getChildren()
      .find((child) => child.token === "group")!
      .getString(),
  ).toBe(group.getString())
  const footprint = api.parseKicadMod(`(footprint "Part" ${groupText})`)
  expect(footprint.groups[0]).toBeInstanceOf(api.Group)
  expect(footprint.groups[0]!.name).toBe("BoardGroup")
  expect(() => api.SxClass.parse('(component_class "C")')).toThrow()
})

test("existing enabled compatibility forms and the sheetname API stay usable", () => {
  for (const [flag, value] of [
    ["yes", true],
    ["no", false],
    ["true", true],
    ["false", false],
    ["", false],
  ] as const) {
    const { board, placement } = placementFrom(
      `(placement (sheetname "S") (enabled ${flag}))`,
    )
    expect(placement.enabled).toBe(value)
    expect(placement.sheetname).toBe("S")
    expect(
      api.parseKicadPcb(board.getString()).zones[0]!.placement!.enabled,
    ).toBe(value)
  }
})
