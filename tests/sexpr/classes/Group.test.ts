import { Group, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("Group - basic parsing", () => {
  const [group] = SxClass.parse(`
    (group ""
        (uuid "4512ea3f-eb4d-4dda-89e4-fc70383dd39e")
        (locked yes)
        (members "04317cef-467f-443a-af53-453cce07bf76" "24b98655-9dec-4c5b-b985-4c0931f0d083"
            "27e3201c-e45c-43af-853d-3b044035836a" "3e76221a-e890-4fd1-8fac-73f7dc4d2b12"
            "405efe00-8823-4d79-bd6d-8b18f47b8639" "51c9d619-01d1-40fb-8b2f-de1aa0dcc372"
            "d3621d9d-4d0f-4424-a8ad-369bebf1d642" "dad5d948-688e-47a2-b752-4268a283b0cf"
            "e7e9e5c9-0b4a-4d10-ba6e-99e54805e774" "ffe5e239-c8d0-4f02-b4e9-0e1ef1c95dce"
        )
    )
  `)

  expect(group).toBeInstanceOf(Group)
  const grp = group as Group
  expect(grp.name).toBe("")
  expect(grp.uuid).toBe("4512ea3f-eb4d-4dda-89e4-fc70383dd39e")
  expect(grp.locked).toBe(true)
  expect(grp.members).toHaveLength(10)
  expect(grp.members[0]).toBe("04317cef-467f-443a-af53-453cce07bf76")
  expect(grp.members[9]).toBe("ffe5e239-c8d0-4f02-b4e9-0e1ef1c95dce")
})

test("Group - with name", () => {
  const [group] = SxClass.parse(`
    (group "My Group"
        (uuid "12345678-1234-1234-1234-123456789012")
        (members "abc" "def")
    )
  `)

  const grp = group as Group
  expect(grp.name).toBe("My Group")
  expect(grp.uuid).toBe("12345678-1234-1234-1234-123456789012")
  expect(grp.locked).toBe(false)
  expect(grp.members).toEqual(["abc", "def"])
})

test("Group - constructor", () => {
  const grp = new Group({
    name: "Test Group",
    uuid: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    locked: true,
    members: ["member1", "member2", "member3"],
  })

  expect(grp.name).toBe("Test Group")
  expect(grp.uuid).toBe("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee")
  expect(grp.locked).toBe(true)
  expect(grp.members).toEqual(["member1", "member2", "member3"])
})

test("Group - getString output", () => {
  const [group] = SxClass.parse(`
    (group "My Group"
        (uuid "12345678-1234-1234-1234-123456789012")
        (locked yes)
        (members "abc" "def" "ghi")
    )
  `)

  const grp = group as Group
  const output = grp.getString()

  expect(output).toContain('(group "My Group"')
  expect(output).toContain("12345678-1234-1234-1234-123456789012")
  expect(output).toContain("(locked yes)")
  expect(output).toContain("(members")
  expect(output).toContain('"abc"')
  expect(output).toContain('"def"')
  expect(output).toContain('"ghi"')
})

test("Group - empty members", () => {
  const grp = new Group({
    name: "Empty Group",
    uuid: "12345678-1234-1234-1234-123456789012",
    members: [],
  })

  expect(grp.members).toEqual([])
  const output = grp.getString()
  expect(output).toContain("(members)")
})
