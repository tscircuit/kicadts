import { expect, test } from "bun:test"
import { Bus, BusEntry, KicadSch, SxClass } from "lib/sexpr"

test("KicadSch parses bus and bus_entry instead of throwing", () => {
  const [parsed] = SxClass.parse(`
    (kicad_sch
      (version 20240101)
      (generator eeschema)
      (uuid 01234567-89ab-cdef-0123-456789abcdef)
      (wire (pts (xy 0 0) (xy 10 0)))
      (bus
        (pts (xy 10 0) (xy 10 20))
        (uuid 11111111-1111-1111-1111-111111111111)
      )
      (bus_entry
        (at 10 10)
        (size 2.54 2.54)
        (uuid 22222222-2222-2222-2222-222222222222)
      )
    )
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const schematic = parsed as KicadSch
  expect(schematic.wires).toHaveLength(1)
  expect(schematic.buses).toHaveLength(1)
  expect(schematic.buses[0]).toBeInstanceOf(Bus)
  expect(schematic.busEntries).toHaveLength(1)
  expect(schematic.busEntries[0]).toBeInstanceOf(BusEntry)
  expect(schematic.busEntries[0]?.size).toEqual({ x: 2.54, y: 2.54 })

  const roundTrip = schematic.getString()
  expect(roundTrip).toContain("(bus")
  expect(roundTrip).toContain("(bus_entry")

  const [reparsed] = SxClass.parse(roundTrip)
  expect(reparsed).toBeInstanceOf(KicadSch)
  expect((reparsed as KicadSch).buses).toHaveLength(1)
  expect((reparsed as KicadSch).busEntries).toHaveLength(1)
})
