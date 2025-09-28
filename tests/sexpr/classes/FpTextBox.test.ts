import {
  FpTextBox,
  FpTextBoxAngle,
  FpTextBoxEnd,
  FpTextBoxStart,
  Layer,
  Pts,
  Stroke,
  TextEffects,
  Uuid,
  SxClass,
} from "lib/sexpr"
import { expect, test } from "bun:test"

test("FpTextBox", () => {
  const [textBox] = SxClass.parse(`
    (fp_text_box locked "Notes"
      (start 0 0)
      (end 10 5)
      (pts (xy 0 0) (xy 10 0) (xy 10 5) (xy 0 5))
      (angle 45)
      (layer F.SilkS)
      (effects (font (size 1 1) (thickness 0.15)))
      (stroke (width 0.1) (type solid) (color 0 0 0 1))
      (uuid 11111111-2222-3333-4444-555555555555)
      (render_cache "Notes text" 0 0)
    )
  `)

  expect(textBox).toBeInstanceOf(FpTextBox)
  const fpTextBox = textBox as FpTextBox

  expect(fpTextBox.locked).toBe(true)
  expect(fpTextBox.text).toBe("Notes")
  expect(fpTextBox.start).toBeInstanceOf(FpTextBoxStart)
  expect(fpTextBox.start?.x).toBe(0)
  expect(fpTextBox.end).toBeInstanceOf(FpTextBoxEnd)
  expect(fpTextBox.end?.y).toBe(5)
  expect(fpTextBox.pts).toBeInstanceOf(Pts)
  expect(fpTextBox.pts?.points.length).toBe(4)
  expect(fpTextBox.angle).toBeInstanceOf(FpTextBoxAngle)
  expect(fpTextBox.angle?.value).toBe(45)
  expect(fpTextBox.layer).toBeInstanceOf(Layer)
  expect(fpTextBox.effects).toBeInstanceOf(TextEffects)
  expect(fpTextBox.stroke).toBeInstanceOf(Stroke)
  expect(fpTextBox.uuid).toBeInstanceOf(Uuid)
  expect(fpTextBox.unknownChildren.length).toBe(1)

  fpTextBox.locked = false

  expect(fpTextBox.getString()).toMatchInlineSnapshot(`
    "(fp_text_box
      \"Notes\"
      (start 0 0)
      (end 10 5)
      (pts
        (xy 0 0)
        (xy 10 0)
        (xy 10 5)
        (xy 0 5)
      )
      (angle 45)
      (layer F.SilkS)
      (effects
        (font
          (size 1 1)
          (thickness 0.15)
        )
      )
      (stroke
        (width 0.1)
        (type solid)
        (color 0 0 0 1)
      )
      (uuid 11111111-2222-3333-4444-555555555555)
      (render_cache \"Notes text\" 0 0)
    )"
  `)
})
