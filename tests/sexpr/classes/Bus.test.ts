import { expect, test } from "bun:test"
import { Bus, BusEntry, KicadSch, parseKicadSch, Pts, Xy } from "lib/sexpr"

// Reduced from KiCad's official cm5_minima demo:
// https://gitlab.com/kicad/code/kicad/-/blob/b7066f886375b186ca8fa469de3a6382f6bba400/demos/cm5_minima/DSI_CSI.kicad_sch#L1297
const busSchematic = `
  (kicad_sch
    (version 20250610)
    (generator "eeschema")
    (bus_entry
      (at 87.63 57.15)
      (size 2.54 2.54)
      (stroke (width 0) (type default))
      (uuid "07c0f2f5-fe60-4de6-8667-6efa2ccb632f")
    )
    (bus
      (pts (xy 87.63 41.91) (xy 87.63 36.83))
      (stroke (width 0) (type default))
      (uuid "18676cf4-f51f-45af-9a34-ae7573f26ea3")
    )
  )
`

test("schematics expose parsed buses and bus entries", () => {
  const schematic = parseKicadSch(busSchematic)

  expect(schematic.busEntries).toHaveLength(1)
  const busEntry = schematic.busEntries[0]!
  expect(busEntry).toBeInstanceOf(BusEntry)
  expect(busEntry.at).toMatchObject({ x: 87.63, y: 57.15 })
  expect(busEntry.size).toEqual({ x: 2.54, y: 2.54 })
  expect(busEntry.stroke?.type).toBe("default")
  expect(busEntry.uuid?.value).toBe("07c0f2f5-fe60-4de6-8667-6efa2ccb632f")

  expect(schematic.buses).toHaveLength(1)
  const bus = schematic.buses[0]!
  expect(bus).toBeInstanceOf(Bus)
  expect(bus.points?.points).toMatchObject([
    { x: 87.63, y: 41.91 },
    { x: 87.63, y: 36.83 },
  ])
  expect(bus.stroke?.width).toBe(0)
  expect(bus.uuid?.value).toBe("18676cf4-f51f-45af-9a34-ae7573f26ea3")

  expect(schematic.getString()).toMatchInlineSnapshot(`
    "(kicad_sch
      (version 20250610)
      (generator eeschema)
      (bus_entry
        (at 87.63 57.15)
        (size 2.54 2.54)
        (stroke
          (width 0)
          (type default)
        )
        (uuid 07c0f2f5-fe60-4de6-8667-6efa2ccb632f)
      )
      (bus
        (pts
          (xy 87.63 41.91)
          (xy 87.63 36.83)
        )
        (stroke
          (width 0)
          (type default)
        )
        (uuid 18676cf4-f51f-45af-9a34-ae7573f26ea3)
      )
    )"
  `)
})

test("buses and bus entries can be constructed and edited", () => {
  const schematic = new KicadSch({
    buses: [new Bus({ points: new Pts([new Xy(0, 0), new Xy(0, 10)]) })],
    busEntries: [new BusEntry({ at: [0, 5], size: { x: 2.54, y: -2.54 } })],
  })

  const reparsed = parseKicadSch(schematic.getString())
  expect(reparsed.buses[0]?.points?.points).toMatchObject([
    { x: 0, y: 0 },
    { x: 0, y: 10 },
  ])
  expect(reparsed.busEntries[0]?.at).toMatchObject({ x: 0, y: 5 })
  expect(reparsed.busEntries[0]?.size).toEqual({ x: 2.54, y: -2.54 })

  schematic.buses = []
  schematic.busEntries = []
  expect(schematic.getString()).toBe("(kicad_sch)")
})

test.each([
  [
    '(bus (uuid "a") (uuid "b"))',
    "bus does not support repeated child tokens: uuid",
  ],
  [
    "(bus_entry (at 0 0) (at 1 1))",
    "bus_entry does not support repeated child tokens: at",
  ],
])("%s still rejects a repeated child", (source, expectedError) => {
  expect(() => parseKicadSch(`(kicad_sch ${source})`)).toThrow(expectedError)
})
