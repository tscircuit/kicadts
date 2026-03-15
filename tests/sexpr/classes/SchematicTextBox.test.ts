import { expect, test } from "bun:test"
import {
  SchematicTextBox,
  SchematicTextBoxFill,
  SchematicTextBoxMargins,
  SchematicTextBoxSize,
  Stroke,
  TextEffects,
  Uuid,
  At,
  SxClass,
} from "lib/sexpr"

test("SchematicTextBox", () => {
  const [parsed] = SxClass.parse(`
    (text_box "max output signal current:\n400uA typical\n520uA max"
      (exclude_from_sim no)
      (at 250.19 102.87 0)
      (size 27.94 15.24)
      (margins 0.9525 0.9525 0.9525 0.9525)
      (stroke
        (width 0)
        (type solid)
      )
      (fill
        (type none)
      )
      (effects
        (font
          (size 1.27 1.27)
        )
        (justify left top)
      )
      (uuid "02c188b7-5dfe-4126-b716-2ad482db7647")
    )
  `)

  expect(parsed).toBeInstanceOf(SchematicTextBox)
  const textBox = parsed as SchematicTextBox

  expect(textBox.text).toBe(
    "max output signal current:\n400uA typical\n520uA max",
  )
  expect(textBox.excludeFromSim).toBe(false)
  expect(textBox.at).toBeInstanceOf(At)
  expect(textBox.at?.x).toBe(250.19)
  expect(textBox.at?.y).toBe(102.87)
  expect(textBox.size).toBeInstanceOf(SchematicTextBoxSize)
  expect(textBox.size?.width).toBe(27.94)
  expect(textBox.size?.height).toBe(15.24)
  expect(textBox.margins).toBeInstanceOf(SchematicTextBoxMargins)
  expect(textBox.margins?.top).toBe(0.9525)
  expect(textBox.margins?.right).toBe(0.9525)
  expect(textBox.stroke).toBeInstanceOf(Stroke)
  expect(textBox.fill).toBeInstanceOf(SchematicTextBoxFill)
  expect(textBox.fill?.type).toBe("none")
  expect(textBox.effects).toBeInstanceOf(TextEffects)
  expect(textBox.uuid).toBeInstanceOf(Uuid)
  expect(textBox.uuid?.value).toBe("02c188b7-5dfe-4126-b716-2ad482db7647")

  expect(textBox.getString()).toMatchInlineSnapshot(`
    "(text_box "max output signal current:\\n400uA typical\\n520uA max"
      (exclude_from_sim no)
      (at 250.19 102.87 0)
      (size 27.94 15.24)
      (margins 0.9525 0.9525 0.9525 0.9525)
      (stroke
        (width 0)
        (type solid)
      )
      (fill
        (type none)
      )
      (effects
        (font
          (size 1.27 1.27)
        )
        (justify left top)
      )
      (uuid 02c188b7-5dfe-4126-b716-2ad482db7647)
    )"
  `)
})
