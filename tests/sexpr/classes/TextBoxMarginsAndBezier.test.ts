import { describe, expect, test } from "bun:test"
import {
  Bezier,
  KicadSch,
  Polyline,
  SchematicSymbol,
  SxClass,
  SymbolBezier,
  SymbolTextBox,
  TextBoxMargins,
} from "lib/sexpr"

describe("TextBoxMargins, Bezier, and Schematic Polyline fill", () => {
  test("parses and round-trips schematic text_box with margins", () => {
    const raw = `(kicad_sch
  (version 20250114)
  (generator "eeschema")
  (generator_version "9.0.1")
  (uuid "d3006a56-9b96-4f3e-b41d-c072fb9094a2")
  (paper "A4")
  (text_box "Sallen-Key Low-pass Filter"
    (exclude_from_sim no)
    (at 137.16 40.64 0)
    (size 73.66 36.83)
    (margins 0.9525 0.9525 0.9525 0.9525)
    (stroke
      (width 0)
      (type default)
    )
    (fill
      (type color)
      (color 255 255 194 1)
    )
    (effects
      (font
        (size 1.27 1.27)
      )
      (justify left)
    )
    (uuid "2da2bd8c-1f27-4e78-b6eb-76f1e6b3f0fd")
  )
)`
    const [sch] = SxClass.parse(raw) as [KicadSch]
    expect(sch).toBeInstanceOf(KicadSch)
    expect(sch.textBoxes).toHaveLength(1)

    const tb = sch.textBoxes[0]!
    expect(tb).toBeInstanceOf(SymbolTextBox)
    expect(tb.margins).toBeInstanceOf(TextBoxMargins)
    expect(tb.margins?.left).toBe(0.9525)
    expect(tb.margins?.top).toBe(0.9525)
    expect(tb.margins?.right).toBe(0.9525)
    expect(tb.margins?.bottom).toBe(0.9525)
    expect(tb.margins?.toObject()).toEqual({
      left: 0.9525,
      top: 0.9525,
      right: 0.9525,
      bottom: 0.9525,
    })

    const [reparsed] = SxClass.parse(sch.getString()) as [KicadSch]
    expect(reparsed.getString()).toBe(sch.getString())
  })

  test("parses and round-trips symbol text_box with margins", () => {
    const raw = `(symbol "Demo:Boxed"
  (symbol "Boxed_0_1"
    (text_box "Internal Note"
      (at 0 0 0)
      (size 10 5)
      (margins 0.5 1 1.5 2)
      (stroke
        (width 0.1)
        (type solid)
      )
      (fill
        (type none)
      )
      (effects
        (font
          (size 1.27 1.27)
        )
      )
    )
  )
)`
    const [sym] = SxClass.parse(raw) as [SchematicSymbol]
    expect(sym).toBeInstanceOf(SchematicSymbol)
    const unit = sym.subSymbols[0]!
    expect(unit.textBoxes).toHaveLength(1)

    const tb = unit.textBoxes[0]!
    expect(tb).toBeInstanceOf(SymbolTextBox)
    expect(tb.margins?.toObject()).toEqual({
      left: 0.5,
      top: 1,
      right: 1.5,
      bottom: 2,
    })

    expect(sym.getString()).toBe(raw)
  })

  test("parses and round-trips symbol bezier curves and schematic bezier curves", () => {
    const raw = `(kicad_sch
  (version 20250114)
  (generator "eeschema")
  (generator_version "9.0.1")
  (uuid "d3006a56-9b96-4f3e-b41d-c072fb9094a2")
  (paper "A4")
  (lib_symbols
    (symbol "Connector_Specialized:Conn_Coax"
      (symbol "Conn_Coax_0_1"
        (bezier
          (pts
            (xy 0 1.27) (xy -0.3556 1.27) (xy -0.635 0.635) (xy -0.635 0)
          )
          (stroke
            (width 0.254)
            (type default)
          )
          (fill
            (type none)
          )
        )
      )
    )
  )
  (polyline
    (pts
      (xy 10 10) (xy 20 20)
    )
    (stroke
      (width 0)
      (type default)
    )
    (fill
      (type none)
    )
    (uuid "22222222-2222-2222-2222-222222222222")
  )
  (bezier
    (pts
      (xy 0 0) (xy 1 2) (xy 3 2) (xy 4 0)
    )
    (stroke
      (width 0.15)
      (type solid)
    )
    (fill
      (type none)
    )
    (uuid "11111111-1111-1111-1111-111111111111")
  )
)`
    const [sch] = SxClass.parse(raw) as [KicadSch]
    expect(sch).toBeInstanceOf(KicadSch)

    const sym = sch.libSymbols?.symbols[0]?.subSymbols[0]
    expect(sym?.beziers).toHaveLength(1)
    expect(sym?.beziers[0]).toBeInstanceOf(SymbolBezier)
    expect(sym?.beziers[0]?.fill?.type).toBe("none")

    expect(sch.polylines).toHaveLength(1)
    expect(sch.polylines[0]).toBeInstanceOf(Polyline)
    expect(sch.polylines[0]?.fill?.type).toBe("none")

    expect(sch.beziers).toHaveLength(1)
    expect(sch.beziers[0]).toBeInstanceOf(Bezier)
    expect(sch.beziers[0]?.fill?.type).toBe("none")
    expect(sch.beziers[0]?.uuid?.value).toBe(
      "11111111-1111-1111-1111-111111111111",
    )

    const [reparsed] = SxClass.parse(sch.getString()) as [KicadSch]
    expect(reparsed.getString()).toBe(sch.getString())
  })
})
