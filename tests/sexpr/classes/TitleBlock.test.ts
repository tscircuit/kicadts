import { SxClass, TitleBlock } from "lib/sexpr"
import { expect, test } from "bun:test"

test("TitleBlock", () => {
  const [titleBlock] = SxClass.parse(`
    (title_block
      (title "Project Title")
      (date "2024-05-12")
      (rev "A1")
      (company "ACME Corp")
      (comment 2 "Secondary comment")
      (comment 1 "Primary comment")
    )
  `)

  expect(titleBlock).toBeInstanceOf(TitleBlock)

  const block = titleBlock as TitleBlock
  expect(block.title).toBe("Project Title")
  expect(block.date).toBe("2024-05-12")
  expect(block.rev).toBe("A1")
  expect(block.company).toBe("ACME Corp")
  expect(block.getComment(1)).toBe("Primary comment")
  expect(block.getComment(2)).toBe("Secondary comment")

  block.setComment(3, "Additional note")
  expect(block.getComment(3)).toBe("Additional note")

  expect(block.getString()).toMatchInlineSnapshot(`
    "(title_block
      (title \"Project Title\")
      (date \"2024-05-12\")
      (rev \"A1\")
      (company \"ACME Corp\")
      (comment 1 \"Primary comment\")
      (comment 2 \"Secondary comment\")
      (comment 3 \"Additional note\")
    )"
  `)
})
