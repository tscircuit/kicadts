import { expect, test } from "bun:test"
import {
  At,
  GrText,
  type GrTextPosition,
  TextEffects,
  Xy,
  parseKicadPcb,
} from "lib/sexpr"

// KiCad's PCB text parser accepts (at x y [angle]), and its writer emits at:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr_parser.cpp#L3841-L3884
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/pcbnew/pcb_io/kicad_sexpr/pcb_io_kicad_sexpr.cpp#L2290-L2302
const boardWithText = `(kicad_pcb
  (version 20260206) (generator "pcbnew")
  (general (thickness 1.6))
  (layers (0 "F.Cu" signal) (2 "B.Cu" signal) (5 "F.SilkS" user))
  (gr_text "Position test" (at 12.5 -8 90) (layer "F.SilkS")
    (uuid "00000000-0000-0000-0000-000000000001")
    (effects (font (size 1 1) (thickness 0.15)))))`

const positionCases: Array<{ position: GrTextPosition; output: string }> = [
  { position: { x: 12.5, y: -8 }, output: "(at 12.5 -8)" },
  {
    position: { x: 12.5, y: -8, angle: undefined },
    output: "(at 12.5 -8)",
  },
  { position: { x: 0, y: 0, angle: 0 }, output: "(at 0 0 0)" },
  {
    position: { x: -2.5, y: 4.75, angle: -45 },
    output: "(at -2.5 4.75 -45)",
  },
]

test.each(positionCases)(
  "GrText object position emits the PCB at token: %j",
  ({ position, output }) => {
    const text = new GrText({
      text: "Position test",
      position,
      layer: "F.SilkS",
      effects: TextEffects.fromSexprPrimitives([
        ["font", ["size", 1, 1], ["thickness", 0.15]],
      ]),
    })
    expect(text.getString()).toContain(output)
    expect(text.getString()).not.toContain("(xy ")
    const board = parseKicadPcb(`(kicad_pcb ${text.getString()})`)
    const roundTripped = board.graphicTexts[0]!
    expect(roundTripped.position).toBeInstanceOf(At)
    expect(roundTripped.position?.x).toBe(position.x)
    expect(roundTripped.position?.y).toBe(position.y)
    expect((roundTripped.position as At).angle).toBe(position.angle)
  },
)

test("moving parsed board text with an object retains a valid at position", () => {
  const board = parseKicadPcb(boardWithText)
  const text = board.graphicTexts[0]!
  text.position = { x: -3.25, y: 6.5 }
  const output = board.getString()
  expect(output).toContain("(at -3.25 6.5)")
  expect(output).not.toContain("(xy ")

  for (const parsed of [board, parseKicadPcb(output)]) {
    const moved = parsed.graphicTexts[0]!
    expect(moved.position).toBeInstanceOf(At)
    expect(moved.position?.x).toBe(-3.25)
    expect(moved.position?.y).toBe(6.5)
    expect((moved.position as At).angle).toBeUndefined()
    expect(moved.text).toBe("Position test")
    expect(moved.layer?.names).toEqual(["F.SilkS"])
    expect(moved.uuid?.value).toBe("00000000-0000-0000-0000-000000000001")
    expect(moved.effects?.font.size).toEqual({ height: 1, width: 1 })
    expect(moved.effects?.font.thickness).toBe(0.15)
  }
})

test("object and tuple positions agree without changing the input object", () => {
  const position = { x: 7.5, y: -2 }
  const objectText = new GrText({ position })
  const tupleText = new GrText({ position: [7.5, -2] })
  expect(objectText.getString()).toBe(tupleText.getString())
  position.x = 100
  expect(objectText.position?.x).toBe(7.5)
  expect(position).toEqual({ x: 100, y: -2 })
})

test("existing At and explicit Xy positions preserve their instance identity", () => {
  const at = new At([1, 2, 30])
  const xy = new Xy(3, 4)
  const text = new GrText({ position: at })
  expect(text.position).toBe(at)
  expect(text.getString()).toContain("(at 1 2 30)")
  text.position = xy
  expect(text.position).toBe(xy)
  expect(text.getString()).toContain("(xy 3 4)")
  text.position = [5, 6]
  expect(text.getString()).toContain("(at 5 6)")
  text.position = undefined
  expect(text.position).toBeUndefined()
  expect(text.getString()).not.toContain("(at ")
  expect(text.getString()).not.toContain("(xy ")
})

test("default constructors and absent position still omit position", () => {
  for (const text of [new GrText(), new GrText({}), new GrText("Text")]) {
    expect(text.position).toBeUndefined()
    expect(text.getString()).not.toContain("(at ")
    expect(text.getString()).not.toContain("(xy ")
  }
})

test("parsing still rejects conflicting at and xy position children", () => {
  expect(() =>
    parseKicadPcb(
      boardWithText.replace("(at 12.5 -8 90)", "(at 1 2) (xy 3 4)"),
    ),
  ).toThrow(/both at and xy/)
})
