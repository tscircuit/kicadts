import { expect, test } from "bun:test"
import {
  BusAlias,
  BusAliasMembers,
  GroupMembers,
  KicadSch,
  parseKicadSch,
  SxClass,
} from "lib/sexpr"

test("schematics parse and preserve multiple bus aliases", () => {
  const source = `(kicad_sch
    (bus_alias "GPIO" (members "D0" "D1" "D2"))
    (bus_alias "CONTROL" (members "~{RESET}" "GPIO")))`
  const schematic = parseKicadSch(source)
  expect(schematic.busAliases).toHaveLength(2)
  expect(schematic.busAliases[0]).toBeInstanceOf(BusAlias)
  expect(schematic.busAliases[0]!.name).toBe("GPIO")
  expect(schematic.busAliases[0]!.members).toEqual(["D0", "D1", "D2"])
  expect(schematic.busAliases[1]!.members).toEqual(["~{RESET}", "GPIO"])
  expect(schematic.busAliases[0]!.getChildren()[0]).toBeInstanceOf(
    BusAliasMembers,
  )
  expect(parseKicadSch(schematic.getString()).getString()).toBe(
    schematic.getString(),
  )
})

test("bus aliases can be constructed and edited without sharing input arrays", () => {
  const members = ["D0", "D1"]
  const alias = new BusAlias({ name: "GPIO", members })
  members.push("D2")
  expect(alias.members).toEqual(["D0", "D1"])
  alias.members.push("D3")
  expect(alias.members).toEqual(["D0", "D1"])

  alias.name = "CONTROL"
  alias.members = ["CLK", "~{RESET}"]
  const aliases = [alias]
  const schematic = new KicadSch({ busAliases: aliases })
  aliases.length = 0
  schematic.busAliases.length = 0
  expect(schematic.busAliases).toHaveLength(1)

  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.busAliases[0]!.name).toBe("CONTROL")
  expect(reparsed.busAliases[0]!.members).toEqual(["CLK", "~{RESET}"])
})

test("bus aliases preserve escaped names and numeric-looking strings", () => {
  const name = 'Signals "quoted"\\path\nnext'
  const members = ["0", "nil", "#t", "A B", 'D"0', "A\\B", "A\nB", "GPIO[0..7]"]
  const schematic = new KicadSch({
    busAliases: [new BusAlias({ name, members })],
  })
  const alias = parseKicadSch(schematic.getString()).busAliases[0]!
  expect(alias.name).toBe(name)
  expect(alias.members).toEqual(members)
})

test("bus aliases support an empty members list", () => {
  const alias = new BusAlias({ name: "EMPTY" })
  const schematic = parseKicadSch(
    new KicadSch({ busAliases: [alias] }).getString(),
  )
  expect(schematic.busAliases[0]!.members).toEqual([])
  expect(schematic.busAliases[0]!.getString()).toContain("(members)")
})

test("members registrations remain scoped to bus aliases and groups", () => {
  const aliasMembers = SxClass.parsePrimitiveSexpr(["members", "D0", "D1"], {
    parentToken: "bus_alias",
  })
  const groupMembers = SxClass.parsePrimitiveSexpr(
    ["members", "11111111-1111-4111-8111-111111111111"],
    { parentToken: "group" },
  )
  expect(aliasMembers).toBeInstanceOf(BusAliasMembers)
  expect(groupMembers).toBeInstanceOf(GroupMembers)
  expect(groupMembers).not.toBeInstanceOf(BusAliasMembers)
})

test.each([
  "(bus_alias)",
  '(bus_alias 123 (members "D0"))',
  '(bus_alias "GPIO")',
  '(bus_alias "GPIO" "D0")',
  '(bus_alias "GPIO" (members 123))',
  '(bus_alias "GPIO" (members #t))',
  '(bus_alias "GPIO" (members nil))',
  '(bus_alias "GPIO" (members (unknown "D0")))',
  '(bus_alias "GPIO" (members "D0") (at 0 0))',
])("bus aliases reject malformed input: %s", (source) => {
  expect(() => parseKicadSch(`(kicad_sch ${source})`)).toThrow()
})

test("bus aliases reject duplicate members sections", () => {
  expect(() =>
    parseKicadSch(`(kicad_sch
    (bus_alias "GPIO" (members "D0") (members "D1")))`),
  ).toThrow(/repeated child token "members"/)
})
