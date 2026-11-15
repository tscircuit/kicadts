import { expect, test } from "bun:test"
import { PadPrimitiveGrCircle, parseKicadMod, parseKicadPcb } from "lib/sexpr"

// Board geometry comes from KiCad's issue17559 fixture at
// 4c23271608ae7fa9e584c6f63b57e54163832c48, with the fill varied below.
// KiCad 8.0.9 parsePCB_SHAPE accepts both "yes" and "solid" for filled
// board graphics and custom-pad primitives.
const boardWithCircle = (fill: string) => `(kicad_pcb
  (gr_circle
    (center 55 -47)
    (end 65 -47)
    (locked yes)
    (stroke (width 0.15) (type default))
    (fill ${fill})
    (layer "Cmts.User")
    (uuid "4662a067-9f60-4ec4-80f5-5b883188d85a")
  )
)`

// Custom-pad circle geometry comes from KiCad's TinyTapeout
// SolderJumper-2_Bridged_Throughole1 footprint at the same revision.
const footprintWithCircle = (fill: string) => `(footprint "SolidCircle"
  (layer "F.Cu")
  (pad "1" smd custom
    (at 0 0) (size 1 1) (layers "F.Cu" "F.Mask")
    (options (clearance outline) (anchor circle))
    (primitives
      (gr_circle
        (center 0 0.25) (end 0.5 0.25) (width 0) (fill ${fill})
      )
    )
  )
)`

const fillCases = [
  ["solid", true],
  ["yes", true],
  ["none", false],
  ["no", false],
] as const

test.each(fillCases)(
  "board circle fill %s survives serialization",
  (fill, filled) => {
    const board = parseKicadPcb(boardWithCircle(fill))
    const output = board.getString()
    expect(output).toContain(`(fill ${fill})`)

    for (const parsed of [board, parseKicadPcb(output)]) {
      expect(parsed.graphicCircles).toHaveLength(1)
      const circle = parsed.graphicCircles[0]!
      expect(circle.fill?.filled).toBe(filled)
      expect(circle.centerPoint).toEqual({ x: 55, y: -47 })
      expect(circle.endPoint).toEqual({ x: 65, y: -47 })
      expect(circle.stroke?.width).toBe(0.15)
      expect(circle.layer?.names).toEqual(["Cmts.User"])
      expect(circle.locked).toBe(true)
      expect(circle.uuid).toBe("4662a067-9f60-4ec4-80f5-5b883188d85a")
    }
  },
)

test.each(fillCases)(
  "custom-pad circle fill %s survives serialization",
  (fill, filled) => {
    const footprint = parseKicadMod(footprintWithCircle(fill))
    const output = footprint.getString()
    expect(output).toContain(`(fill ${fill})`)

    for (const parsed of [footprint, parseKicadMod(output)]) {
      expect(parsed.fpPads).toHaveLength(1)
      const pad = parsed.fpPads[0]!
      expect(pad.number).toBe("1")
      expect(pad.primitives?.graphics).toHaveLength(1)
      const circle = pad.primitives?.graphics[0]
      expect(circle).toBeInstanceOf(PadPrimitiveGrCircle)
      if (!(circle instanceof PadPrimitiveGrCircle)) {
        throw new Error("Expected a custom-pad circle")
      }
      expect(circle.fill).toBe(filled)
      expect(circle.center).toMatchObject({ x: 0, y: 0.25 })
      expect(circle.end).toMatchObject({ x: 0.5, y: 0.25 })
      expect(circle.width).toBe(0)
    }
  },
)

test("circle parsers continue rejecting unknown fill tokens", () => {
  expect(() => parseKicadPcb(boardWithCircle("unsupported"))).toThrow(
    /fill expects/,
  )
  expect(() => parseKicadMod(footprintWithCircle("unsupported"))).toThrow(
    /fill expects/,
  )
})
