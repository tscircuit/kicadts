import { expect, test } from "bun:test"
import {
  GrArc,
  PadPrimitiveGrArc,
  parseKicadMod,
  parseKicadPcb,
  parseKicadSexpr,
} from "lib"
import { parseKicadPcb as parseFromSexpr } from "lib/sexpr"

const arcText = `(gr_arc
  (start 0 -2.5) (mid -3.25 0) (end 4.5 -6.75)
  (stroke (width 0.15) (type default)) (layer "F.SilkS")
  (uuid "97270e65-75ba-45f3-81cc-8b179440be64"))`
const boardText = `(kicad_pcb ${arcText})`
const pointCases = [
  { field: "start", getter: "startPoint", expected: { x: 0, y: -2.5 } },
  { field: "mid", getter: "midPoint", expected: { x: -3.25, y: 0 } },
  { field: "end", getter: "endPoint", expected: { x: 4.5, y: -6.75 } },
] as const

// These public source entry points must provide the same coordinate snapshots
// as constructed arcs, regardless of the registered point implementation.
for (const [entry, parseBoard] of [
  ["root", parseKicadPcb],
  ["sexpr", parseFromSexpr],
] as const) {
  test.each([...pointCases])(
    `${entry} board parse exposes $getter`,
    ({ getter, expected }) => {
      const arc = parseBoard(boardText).graphicArcs[0]!
      expect(arc).toBeInstanceOf(GrArc)
      expect(arc[getter]).toEqual(expected)
    },
  )
}

test("generic public parsing exposes all arc coordinate snapshots", () => {
  const [parsed] = parseKicadSexpr(arcText)
  expect(parsed).toBeInstanceOf(GrArc)
  const arc = parsed as GrArc
  expect(arc.startPoint).toEqual({ x: 0, y: -2.5 })
  expect(arc.midPoint).toEqual({ x: -3.25, y: 0 })
  expect(arc.endPoint).toEqual({ x: 4.5, y: -6.75 })
})

test.each([...pointCases])(
  "$getter returns fresh plain snapshots isolated from edits",
  ({ field, getter, expected }) => {
    const arc = parseKicadPcb(boardText).graphicArcs[0]!
    const neighbor = parseKicadPcb(boardText).graphicArcs[0]!
    const before = arc.getString()
    const snapshot = arc[getter]!
    const second = arc[getter]!
    expect(snapshot).toEqual(expected)
    expect(Object.getPrototypeOf(snapshot)).toBe(Object.prototype)
    expect(Object.keys(snapshot).sort()).toEqual(["x", "y"])
    expect(snapshot).not.toBe(arc[field])
    expect(snapshot).not.toBe(second)
    snapshot.x = 123
    snapshot.y = 456
    expect(arc[getter]).toEqual(expected)
    expect(second).toEqual(expected)
    expect(arc.getString()).toBe(before)
    expect(neighbor[getter]).toEqual(expected)

    arc[field]!.x = -8
    arc[field]!.y = 0
    expect(arc[getter]).toEqual({ x: -8, y: 0 })
    expect(second).toEqual(expected)
    expect(neighbor[getter]).toEqual(expected)
    arc[field] = { x: 0, y: -9 }
    expect(arc[getter]).toEqual({ x: 0, y: -9 })
  },
)

test("constructed arc coordinates are copied from caller input", () => {
  const start = { x: 0, y: -2.5 }
  const mid = { x: -3.25, y: 0 }
  const end = { x: 4.5, y: -6.75 }
  const arc = new GrArc({ start, mid, end, layer: "F.SilkS" })
  start.x = 101
  mid.y = 102
  end.x = 103
  expect(arc.startPoint).toEqual({ x: 0, y: -2.5 })
  expect(arc.midPoint).toEqual({ x: -3.25, y: 0 })
  expect(arc.endPoint).toEqual({ x: 4.5, y: -6.75 })
  const snapshot = arc.startPoint!
  snapshot.y = 104
  expect(arc.startPoint).toEqual({ x: 0, y: -2.5 })
})

test("unset and cleared arc points return undefined", () => {
  const arc = new GrArc()
  expect(arc.startPoint).toBeUndefined()
  expect(arc.midPoint).toBeUndefined()
  expect(arc.endPoint).toBeUndefined()
  arc.start = { x: 0, y: 0 }
  arc.mid = { x: 0, y: 0 }
  arc.end = { x: 0, y: 0 }
  expect(arc.startPoint).toEqual({ x: 0, y: 0 })
  expect(arc.midPoint).toEqual({ x: 0, y: 0 })
  expect(arc.endPoint).toEqual({ x: 0, y: 0 })
  arc.start = undefined
  arc.mid = undefined
  arc.end = undefined
  expect(arc.startPoint).toBeUndefined()
  expect(arc.midPoint).toBeUndefined()
  expect(arc.endPoint).toBeUndefined()
})

test("arc coordinate getters preserve board serialization and round trips", () => {
  let board = parseKicadPcb(boardText)
  const output = board.getString()
  for (let cycle = 0; cycle < 3; cycle++) {
    const arc = board.graphicArcs[0]!
    expect(arc.startPoint).toEqual({ x: 0, y: -2.5 })
    expect(arc.midPoint).toEqual({ x: -3.25, y: 0 })
    expect(arc.endPoint).toEqual({ x: 4.5, y: -6.75 })
    expect(arc.layer?.names).toEqual(["F.SilkS"])
    expect(arc.stroke?.width).toBe(0.15)
    expect(arc.uuid?.value).toBe("97270e65-75ba-45f3-81cc-8b179440be64")
    expect(board.getString()).toBe(output)
    board = parseKicadPcb(board.getString())
  }
})

test("checked-in Corne board exposes parsed arc coordinate snapshots", async () => {
  const board = parseKicadPcb(
    await Bun.file("tests/assets/corne-keyboard.kicad_pcb").text(),
  )
  const arc = board.graphicArcs[0]!
  expect(arc.startPoint).toEqual({ x: 119.062502, y: -1.61875 })
  expect(arc.midPoint).toEqual({ x: 118.662502, y: -1.21875 })
  expect(arc.endPoint).toEqual({ x: 118.262502, y: -1.61875 })
})

test("custom-pad arc points still parse, edit and round trip", () => {
  const footprint = parseKicadMod(`(footprint "Test:Arc" (layer "F.Cu")
    (pad "1" smd custom (at 0 0) (size 1 1) (layers "F.Cu" "F.Mask")
      (options (clearance outline) (anchor circle))
      (primitives (gr_arc (start 0 -2.5) (mid -3.25 0) (end 4.5 -6.75) (width 0)))))`)
  const arc = footprint.fpPads[0]!.primitives!.graphics[0]
  expect(arc).toBeInstanceOf(PadPrimitiveGrArc)
  if (!(arc instanceof PadPrimitiveGrArc)) throw new Error("Expected pad arc")
  expect(arc.start).toMatchObject({ x: 0, y: -2.5 })
  expect(arc.mid).toMatchObject({ x: -3.25, y: 0 })
  expect(arc.end).toMatchObject({ x: 4.5, y: -6.75 })
  expect(arc.width).toBe(0)
  arc.start!.x = -8
  const output = footprint.getString()
  const reparsed = parseKicadMod(output)
  const copy = reparsed.fpPads[0]!.primitives!.graphics[0]
  expect(copy).toBeInstanceOf(PadPrimitiveGrArc)
  if (!(copy instanceof PadPrimitiveGrArc)) throw new Error("Expected pad arc")
  expect(copy.start).toMatchObject({ x: -8, y: -2.5 })
  expect(copy.mid).toMatchObject({ x: -3.25, y: 0 })
  expect(copy.end).toMatchObject({ x: 4.5, y: -6.75 })
  expect(reparsed.getString()).toBe(output)
})

test.each([
  ["missing start", arcText.replace("(start 0 -2.5)", "")],
  ["missing mid", arcText.replace("(mid -3.25 0)", "")],
  ["missing end", arcText.replace("(end 4.5 -6.75)", "")],
  ["missing layer", arcText.replace('(layer "F.SilkS")', "")],
  [
    "invalid coordinates",
    arcText.replace("(start 0 -2.5)", "(start invalid -2.5)"),
  ],
  [
    "duplicate point",
    arcText.replace("(start 0 -2.5)", "(start 0 -2.5) (start 1 2)"),
  ],
  [
    "unknown child",
    arcText.replace("(start 0 -2.5)", "(unknown 1) (start 0 -2.5)"),
  ],
  [
    "unexpected primitive",
    arcText.replace("(start 0 -2.5)", "unexpected (start 0 -2.5)"),
  ],
])("coordinate getters do not change %s rejection", (_name, input) => {
  expect(() => parseKicadPcb(`(kicad_pcb ${input})`)).toThrow()
})
