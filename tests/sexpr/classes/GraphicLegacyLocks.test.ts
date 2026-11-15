import { expect, test } from "bun:test"
import { GrArc, GrLine, parseKicadPcb } from "lib/sexpr"
import { parseToPrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

// Synthetic fixtures follow KiCad 10.0.5 parsePCB_SHAPE at
// 18fb9289ff0efdca53c0352ed81a0973f0a6b58c. A bare locked token is
// accepted immediately after gr_line/gr_arc, before the geometry.
const graphics = [
  { token: "gr_line", mid: "" },
  { token: "gr_arc", mid: "(mid 2 3)" },
] as const

const boardWithGraphic = ({
  graphic,
  header = "",
  tail = "",
}: {
  graphic: (typeof graphics)[number]
  header?: string
  tail?: string
}) => `(kicad_pcb
  (version 20240108)
  (generator pcbnew)
  (layers (0 "F.Cu" signal) (31 "B.Cu" signal) (37 "F.SilkS" user))
  (${graphic.token} ${header}
    (start 1 2) ${graphic.mid} (end 3 2)
    (stroke (width 0.15) (type default))
    (layer "F.SilkS")
    (uuid "97270e65-75ba-45f3-81cc-8b179440be64")
    ${tail}
  )
)`

const lockCases = [
  { header: "locked", tail: "", locked: true, name: "bare lock" },
  { header: "", tail: "(locked)", locked: true, name: "empty list" },
  { header: "", tail: "(locked yes)", locked: true, name: "yes list" },
  { header: "", tail: "(locked no)", locked: false, name: "no list" },
  { header: "", tail: "", locked: false, name: "omitted lock" },
] as const

for (const graphic of graphics) {
  for (const lockCase of lockCases) {
    test(`${graphic.token}: ${lockCase.name} survives a public board round trip`, () => {
      const board = parseKicadPcb(boardWithGraphic({ graphic, ...lockCase }))
      const output = board.getString()
      expect(output.includes("(locked yes)")).toBe(lockCase.locked)

      for (const parsed of [board, parseKicadPcb(output)]) {
        const shapes =
          graphic.token === "gr_line" ? parsed.graphicLines : parsed.graphicArcs
        expect(shapes).toHaveLength(1)
        const shape = shapes[0]!
        expect(shape.locked).toBe(lockCase.locked)
        expect({ x: shape.start?.x, y: shape.start?.y }).toEqual({ x: 1, y: 2 })
        expect({ x: shape.end?.x, y: shape.end?.y }).toEqual({ x: 3, y: 2 })
        if (shape instanceof GrArc) {
          expect({ x: shape.mid?.x, y: shape.mid?.y }).toEqual({ x: 2, y: 3 })
        }
        expect(shape.stroke?.width).toBe(0.15)
        expect(shape.layer?.names).toEqual(["F.SilkS"])
        expect(shape.uuid?.value).toBe("97270e65-75ba-45f3-81cc-8b179440be64")
      }
    })
  }

  test(`${graphic.token}: a parsed bare lock can be removed without locking a neighbor`, () => {
    const board = parseKicadPcb(boardWithGraphic({ graphic, header: "locked" }))
    const shapes =
      graphic.token === "gr_line" ? board.graphicLines : board.graphicArcs
    const shape = shapes[0]!
    const neighbor =
      graphic.token === "gr_line"
        ? new GrLine({
            start: { x: 5, y: 6 },
            end: { x: 7, y: 6 },
            layer: "F.SilkS",
          })
        : new GrArc({
            start: { x: 5, y: 6 },
            mid: { x: 6, y: 7 },
            end: { x: 7, y: 6 },
            layer: "F.SilkS",
          })
    if (neighbor instanceof GrLine) {
      board.graphicLines = [...board.graphicLines, neighbor]
    } else {
      board.graphicArcs = [...board.graphicArcs, neighbor]
    }

    shape.locked = false
    const reparsed = parseKicadPcb(board.getString())
    const roundTripShapes =
      graphic.token === "gr_line" ? reparsed.graphicLines : reparsed.graphicArcs
    expect(roundTripShapes.map((item) => item.locked)).toEqual([false, false])
    expect(
      roundTripShapes.map((item) => ({ x: item.start?.x, y: item.start?.y })),
    ).toEqual([
      { x: 1, y: 2 },
      { x: 5, y: 6 },
    ])
  })

  test(`${graphic.token}: direct primitive factory preserves its caller's input`, () => {
    const [primitive] = parseToPrimitiveSExpr(
      `(${graphic.token} locked (start 1 2) ${graphic.mid} (end 3 2) (layer "F.SilkS"))`,
    )
    if (!Array.isArray(primitive)) throw new Error("Expected graphic list")
    const children = primitive.slice(1)
    const before = structuredClone(children)
    const shape =
      graphic.token === "gr_line"
        ? GrLine.fromSexprPrimitives(children)
        : GrArc.fromSexprPrimitives(children)
    expect(shape.locked).toBe(true)
    expect(shape.getString()).toContain("(locked yes)")
    expect(children).toEqual(before)
  })

  test(`${graphic.token}: existing list-valued fields remain order-independent`, () => {
    // Library compatibility: unlike native KiCad geometry ordering, the existing
    // class factory accepts reordered list children.
    const board = parseKicadPcb(`(kicad_pcb
      (${graphic.token}
        (layer "F.SilkS") (locked yes) (end 3 2)
        ${graphic.mid} (start 1 2) (width 0.25)))`)
    const shape =
      graphic.token === "gr_line"
        ? board.graphicLines[0]!
        : board.graphicArcs[0]!
    expect(shape.locked).toBe(true)
    expect({ x: shape.start?.x, y: shape.start?.y }).toEqual({ x: 1, y: 2 })
    expect({ x: shape.end?.x, y: shape.end?.y }).toEqual({ x: 3, y: 2 })
    expect(shape.width).toBe(0.25)
    expect(parseKicadPcb(board.getString()).getString()).toBe(board.getString())
  })

  test(`${graphic.token}: unsupported primitives, children and duplicate locks still reject`, () => {
    for (const header of ["unsupported", "locked locked"]) {
      expect(() =>
        parseKicadPcb(boardWithGraphic({ graphic, header })),
      ).toThrow()
    }
    for (const tail of [
      "locked",
      "(unexpected_child yes)",
      "(locked yes) (locked no)",
    ]) {
      expect(() => parseKicadPcb(boardWithGraphic({ graphic, tail }))).toThrow()
    }
    expect(() =>
      parseKicadPcb(
        boardWithGraphic({ graphic, header: "locked", tail: "(locked no)" }),
      ),
    ).toThrow()
  })
}
