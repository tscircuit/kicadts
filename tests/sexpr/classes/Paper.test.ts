import { Paper, SxClass } from "lib/sexpr"
import { expect, test } from "bun:test"

test("Paper standard size", () => {
  const [paper] = SxClass.parse(`
    (paper
      A4
      portrait
    )
  `)

  expect(paper).toBeInstanceOf(Paper)

  const page = paper as Paper
  expect(page.size).toBe("A4")
  expect(page.customSize).toBeUndefined()
  expect(page.isPortrait).toBe(true)

  page.isPortrait = false
  page.customSize = { width: 210, height: 297 }

  expect(page.size).toBeUndefined()
  expect(page.customSize).toEqual({ width: 210, height: 297 })

  expect(page.getString()).toMatchInlineSnapshot(`
    "(paper
      210 297
    )"
  `)
})
