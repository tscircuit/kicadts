import { expect, test } from "bun:test"
import { KicadPcb, KicadSch, Paper, SxClass } from "lib/sexpr"

test.each([
  [320, 240],
  [210.5, 297.25],
])("custom paper preserves its %s by %s dimensions", (width, height) => {
  const [paper] = SxClass.parse(`(paper "User" ${width} ${height})`) as [Paper]

  expect(paper.customSize).toEqual({ width, height })
  expect(paper.getString()).toBe(`(paper\n  "User" ${width} ${height}\n)`)
  const [roundTrip] = SxClass.parse(paper.getString()) as [Paper]
  expect(roundTrip.customSize).toEqual({ width, height })
})

test("customSize setter emits the User size marker with both dimensions", () => {
  const paper = new Paper()
  paper.customSize = { width: 320, height: 240 }

  expect(paper.getString()).toBe('(paper\n  "User" 320 240\n)')
  const [roundTrip] = SxClass.parse(paper.getString()) as [Paper]
  expect(roundTrip.customSize).toEqual(paper.customSize)

  paper.size = "A4"
  expect(paper.customSize).toBeUndefined()
  expect(paper.getString()).toBe("(paper\n  A4\n)")
})

test("legacy numeric-only paper input serializes to KiCad's custom format", () => {
  const [paper] = SxClass.parse("(paper 320 240)") as [Paper]
  expect(paper.customSize).toEqual({ width: 320, height: 240 })
  expect(paper.getString()).toBe('(paper\n  "User" 320 240\n)')
})

test.each([KicadSch, KicadPcb])(
  "custom paper survives a document round trip",
  (Document) => {
    const [document] = SxClass.parse(
      `(${Document.token} (paper "User" 320 240))`,
    ) as [KicadSch | KicadPcb]
    const serialized = document.getString()
    expect(serialized).toContain('"User" 320 240')
    const [roundTrip] = SxClass.parse(serialized) as [KicadSch | KicadPcb]
    expect(roundTrip.paper?.customSize).toEqual({ width: 320, height: 240 })
  },
)

test.each(["User", "user", "USER"])(
  "custom %s paper preserves portrait and dimension order",
  (size) => {
    const [paper] = SxClass.parse(`(paper "${size}" 320 240 portrait)`) as [
      Paper,
    ]
    const serialized = paper.getString()
    expect(serialized).toBe('(paper\n  "User" 320 240\n  portrait\n)')
    expect(paper.size).toBe(size)
    expect(paper.customSize).toEqual({ width: 320, height: 240 })
    const [roundTrip] = SxClass.parse(serialized) as [Paper]
    expect(roundTrip.isPortrait).toBe(true)
    expect(roundTrip.customSize).toEqual({ width: 320, height: 240 })
  },
)
