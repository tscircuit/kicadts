import { expect, test } from "bun:test"
import { Group, parseKicadPcb, SxClass } from "lib/sexpr"

test.each([
  'Power "input"',
  String.raw`Power\input`,
  String.raw`Power\n`,
  "Power\\",
  "",
  "001",
  "Power (input)",
  "電源 input",
])("Group preserves the name %j when serialized", (name) => {
  const group = new Group({ name })

  const [roundTripped] = SxClass.parse(group.getString())

  expect(roundTripped).toBeInstanceOf(Group)
  expect((roundTripped as Group).name).toBe(name)
})

test("PCB round-trip preserves an escaped group name and its children", () => {
  const board = parseKicadPcb(String.raw`
    (kicad_pcb
      (group "Power \"input\" \\ output"
        (uuid "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
        (locked yes)
        (members "11111111-2222-3333-4444-555555555555")
      )
    )
  `)

  const originalGroup = board
    .getChildren()
    .find((child) => child instanceof Group)
  expect(originalGroup?.name).toBe('Power "input" \\ output')

  const roundTripped = parseKicadPcb(board.getStringIndented())

  const groups = roundTripped
    .getChildren()
    .filter((child) => child instanceof Group)
  expect(groups).toHaveLength(1)
  expect(groups[0]?.name).toBe('Power "input" \\ output')
  expect(groups[0]?.uuid).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
  expect(groups[0]?.locked).toBe(true)
  expect(groups[0]?.members).toEqual(["11111111-2222-3333-4444-555555555555"])
})
