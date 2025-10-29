import { SxClass, KicadSch, NoConnect } from "lib/sexpr"
import { expect, test } from "bun:test"

test("NoConnect", () => {
  const [parsed] = SxClass.parse(`
	(kicad_sch
        (no_connect
            (at 171.45 130.81)
            (uuid "6309b1ea-35ff-4629-8b7d-248af0b86a3c")
        )
	)
  `)

  expect(parsed).toBeInstanceOf(KicadSch)
  const kicadSch = parsed as KicadSch
  expect(kicadSch.noConnects).toHaveLength(1)

  const noConnect = kicadSch.noConnects[0]
  expect(noConnect).toBeInstanceOf(NoConnect)
  const nc = noConnect as NoConnect

  expect(nc.getString()).toMatchInlineSnapshot(`
    "(no_connect
      (at 171.45 130.81)
      (uuid 6309b1ea-35ff-4629-8b7d-248af0b86a3c)
    )"
  `)
})
