import { expect, test } from "bun:test"
import {
  TextEffects,
  TextEffectsFont,
  TextEffectsFontBold,
  TextEffectsFontItalic,
  parseKicadMod,
  parseKicadPcb,
  parseKicadSch,
  parseKicadSexpr,
} from "lib/sexpr"

// Synthetic fixtures derived from KiCad 10.0.5, not native exports:
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/eeschema/sch_io/kicad_sexpr/sch_io_kicad_sexpr_parser.cpp#L822-L830
// https://github.com/KiCad/kicad-source-mirror/blob/18fb9289ff0efdca53c0352ed81a0973f0a6b58c/eeschema/sch_io/kicad_sexpr/sch_io_kicad_sexpr_parser.cpp#L889-L894
const effectsText = (fontFlags: string, effectFlags = "") => `
  (effects (font (size 1.5 1.2) (thickness 0.2) ${fontFlags})
    (justify left bottom) ${effectFlags})`

const schematicText = (effects: string) => `(kicad_sch
  (version 20250114) (generator "eeschema")
  (uuid "00000000-0000-0000-0000-000000000001") (paper "A4")
  (lib_symbols)
  (text "Assembly note" (at 12.5 20 0) ${effects}
    (uuid "00000000-0000-0000-0000-000000000002")))`

const effectState = (effects: TextEffects) => [
  effects.font.bold,
  effects.font.italic,
  effects.hiddenText,
]

test.each([
  { fontFlags: "(bold)", effectFlags: "", expected: [true, false, false] },
  { fontFlags: "(italic)", effectFlags: "", expected: [false, true, false] },
  { fontFlags: "", effectFlags: "(hide)", expected: [false, false, true] },
  {
    fontFlags: "(bold) (italic)",
    effectFlags: "(hide)",
    expected: [true, true, true],
  },
  { fontFlags: "", effectFlags: "", expected: [false, false, false] },
  {
    fontFlags: "bold italic",
    effectFlags: "hide",
    expected: [true, true, true],
  },
  {
    fontFlags: "(bold yes) (italic yes)",
    effectFlags: "(hide yes)",
    expected: [true, true, true],
  },
  {
    fontFlags: "(bold no) (italic no)",
    effectFlags: "(hide no)",
    expected: [false, false, false],
  },
  {
    fontFlags: "(bold true) (italic true)",
    effectFlags: "(hide true)",
    expected: [true, true, true],
  },
  {
    fontFlags: "(bold false) (italic false)",
    effectFlags: "(hide false)",
    expected: [false, false, false],
  },
  {
    fontFlags: "(bold no) (italic)",
    effectFlags: "(hide no)",
    expected: [false, true, false],
  },
])(
  "schematic text retains its effects: %j",
  ({ fontFlags, effectFlags, expected }) => {
    let schematic = parseKicadSch(
      schematicText(effectsText(fontFlags, effectFlags)),
    )
    for (let cycle = 0; cycle < 3; cycle++) {
      const note = schematic.texts[0]!
      expect(effectState(note.effects!)).toEqual(expected)
      expect(note.value).toBe("Assembly note")
      expect(note.at).toMatchObject({ x: 12.5, y: 20, angle: 0 })
      expect(note.uuid?.value).toBe("00000000-0000-0000-0000-000000000002")
      expect(note.effects!.font.size).toEqual({ height: 1.5, width: 1.2 })
      expect(note.effects!.font.thickness).toBe(0.2)
      expect(note.effects!.justify?.getString()).toBe("(justify left bottom)")
      schematic = parseKicadSch(schematic.getString())
    }
  },
)

test("empty effects serialize as enabled before reparsing", () => {
  const schematic = parseKicadSch(
    schematicText(effectsText("(bold) (italic)", "(hide)")),
  )
  const output = schematic.getString()
  for (const flag of ["bold", "italic", "hide"]) {
    expect(output).toContain(`(${flag} yes)`)
    expect(output).not.toContain(`(${flag} no)`)
  }
})

test("board text retains empty font flags", () => {
  const effects = effectsText("(bold) (italic)")
  const board = parseKicadPcb(`(kicad_pcb
    (version 20260206) (generator "pcbnew") (general (thickness 1.6))
    (layers (0 "F.Cu" signal) (2 "B.Cu" signal) (5 "F.SilkS" user))
    (gr_text "Assembly note" (at 12.5 20) (layer "F.SilkS") ${effects}
      (uuid "00000000-0000-0000-0000-000000000003")))`)
  expect(effectState(board.graphicTexts[0]!.effects!)).toEqual([
    true,
    true,
    false,
  ])
  expect(
    effectState(parseKicadPcb(board.getString()).graphicTexts[0]!.effects!),
  ).toEqual([true, true, false])
})

test("standalone footprint text retains empty font flags", () => {
  const effects = effectsText("(bold) (italic)")
  const footprint = parseKicadMod(`(footprint "Test:Text" (layer "F.Cu")
    (fp_text user "Assembly note" (at 1 2) (layer "F.SilkS") ${effects}))`)
  expect(effectState(footprint.fpTexts[0]!.effects!)).toEqual([
    true,
    true,
    false,
  ])
  expect(
    effectState(parseKicadMod(footprint.getString()).fpTexts[0]!.effects!),
  ).toEqual([true, true, false])
})

test("editing text and toggling effects preserves the empty-flag state", () => {
  const schematic = parseKicadSch(
    schematicText(effectsText("(bold) (italic)", "(hide)")),
  )
  const note = schematic.texts[0]!
  note.value = "Updated note"
  note.at = [25, 30, 90]
  expect(
    effectState(parseKicadSch(schematic.getString()).texts[0]!.effects!),
  ).toEqual([true, true, true])
  note.effects!.font.bold = false
  note.effects!.font.italic = false
  note.effects!.hiddenText = false
  expect(
    effectState(parseKicadSch(schematic.getString()).texts[0]!.effects!),
  ).toEqual([false, false, false])
  note.effects!.font.bold = true
  note.effects!.font.italic = true
  note.effects!.hiddenText = true
  const reparsed = parseKicadSch(schematic.getString()).texts[0]!
  expect(effectState(reparsed.effects!)).toEqual([true, true, true])
  expect(reparsed.value).toBe("Updated note")
  expect(reparsed.at).toMatchObject({ x: 25, y: 30, angle: 90 })
})

test("constructors and standalone public effects parsing retain defaults", () => {
  expect(effectState(new TextEffects())).toEqual([false, false, false])
  const font = new TextEffectsFont()
  font.bold = true
  font.italic = true
  const effects = new TextEffects({ font, hiddenText: true })
  const parsed = parseKicadSexpr(effects.getString())[0]
  expect(parsed).toBeInstanceOf(TextEffects)
  expect(effectState(parsed as TextEffects)).toEqual([true, true, true])
  expect(new TextEffectsFontBold().value).toBe(true)
  expect(new TextEffectsFontItalic().value).toBe(true)
  expect(new TextEffectsFontBold(false).value).toBe(false)
  expect(new TextEffectsFontItalic(false).value).toBe(false)
})

test("direct font factories treat empty expressions as enabled", () => {
  const bold = TextEffectsFontBold.fromSexprPrimitives([])
  const italic = TextEffectsFontItalic.fromSexprPrimitives([])
  expect(bold).toBeInstanceOf(TextEffectsFontBold)
  expect(italic).toBeInstanceOf(TextEffectsFontItalic)
  expect(bold.getString()).toBe("(bold yes)")
  expect(italic.getString()).toBe("(italic yes)")
})

test("neighboring texts keep independent effect states", () => {
  const enabled = parseKicadSch(
    schematicText(effectsText("(bold) (italic)", "(hide)")),
  )
  const plain = parseKicadSch(schematicText(effectsText(""))).texts[0]!
  plain.uuid = "00000000-0000-0000-0000-000000000004"
  plain.value = "Visible note"
  enabled.texts = [...enabled.texts, plain]
  const reparsed = parseKicadSch(enabled.getString())
  expect(reparsed.texts.map((note) => effectState(note.effects!))).toEqual([
    [true, true, true],
    [false, false, false],
  ])
  expect(reparsed.texts.map((note) => note.value)).toEqual([
    "Assembly note",
    "Visible note",
  ])
})

test("nonempty legacy inputs keep the existing permissive boolean behavior", () => {
  for (const fontFlags of [
    "(bold maybe) (italic 1)",
    "(bold no yes) (italic false true)",
  ]) {
    const schematic = parseKicadSch(
      schematicText(effectsText(fontFlags, "(hide maybe)")),
    )
    expect(effectState(schematic.texts[0]!.effects!)).toEqual([
      false,
      false,
      false,
    ])
  }
})

test("unrelated boolean fields retain their existing empty defaults", () => {
  const schematic = parseKicadSch(schematicText(effectsText("")))
  const note = schematic.texts[0]!
  note.excludeFromSim = true
  const output = schematic
    .getString()
    .replace("(exclude_from_sim yes)", "(exclude_from_sim)")
  expect(parseKicadSch(output).texts[0]!.excludeFromSim).toBe(false)
})
