import { expect, test } from "bun:test"
import { Footprint, SxClass } from "lib/sexpr"

test("Footprint generator_version is always serialized as a quoted string", () => {
  const fp = new Footprint({
    libraryLink: "MyPart",
    version: 20240108,
    generator: "pcbnew",
    generatorVersion: "8.0",
  })

  expect(fp.getString()).toContain('(generator_version "8.0")')

  const [parsedUnquoted] = SxClass.parse(`
    (footprint "MyPart"
      (version 20240108)
      (generator pcbnew)
      (generator_version 8.0)
    )
  `)
  expect((parsedUnquoted as Footprint).getString()).toContain(
    '(generator_version "8")',
  )
})
