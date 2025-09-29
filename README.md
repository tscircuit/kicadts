# kicadts

`kicadts` is a TypeScript-first toolkit for reading, editing, and generating KiCad S-expression documents. Every KiCad token is modeled as a class, so you can compose schematics, boards, and footprints entirely in TypeScript and emit KiCad-compatible files with deterministic formatting.

## Local Setup

This repository uses [Bun](https://bun.sh) for scripts and testing.

- `bun install`
- `bun test` — optional, but handy to confirm we still round-trip the KiCad demo files

## Build KiCad Schematics

The high-level classes (`KicadSch`, `Sheet`, `SchematicSymbol`, `Wire`, …) expose setters and getters for their children. Populate the model, then call `getString()` to emit KiCad’s S-expression.

```ts
import { promises as fs } from "node:fs"
import {
  At,
  KicadSch,
  Paper,
  Property,
  Sheet,
  SchematicSymbol,
  TitleBlock,
  Wire,
  Pts,
  Xy,
} from "kicadts"

const schematic = new KicadSch({
  version: 20240101,
  generator: "kicadts-demo",
  titleBlock: new TitleBlock({
    title: "Demo Schematic",
    company: "Example Labs",
  }),
  paper: new Paper({ size: "A4" }),
  properties: [new Property({ key: "Sheetfile", value: "demo.kicad_sch" })],
  sheets: [
    new Sheet({
      position: new At([0, 0, 0]),
      size: { width: 100, height: 80 },
    }),
  ],
  symbols: [
    new SchematicSymbol({
      libraryId: "Device:R",
      at: new At([25.4, 12.7]),
    }),
  ],
  wires: [
    new Wire({
      points: new Pts([new Xy(0, 0), new Xy(25.4, 12.7)]),
    }),
  ],
})

await fs.writeFile("demo.kicad_sch", schematic.getString())
```

## Build KiCad PCBs

Boards follow the same pattern. Compose `KicadPcb` with nets, footprints, segments, and zones. Footprints are reusable whether you embed them on a board or export them as `.kicad_mod` files.

```ts
import { promises as fs } from "node:fs"
import {
  At,
  Footprint,
  FootprintPad,
  FpText,
  KicadPcb,
  PadLayers,
  PadNet,
  PadSize,
  PcbNet,
  TextEffects,
} from "kicadts"

const netGnd = new PcbNet(1, "GND")
const netSignal = new PcbNet(2, "Net-(R1-Pad2)")

const makeText = (type: string, text: string, x: number, y: number, layer: string) =>
  new FpText({
    type,
    text,
    position: new At([x, y]),
    layer,
    effects: new TextEffects({
      font: { size: { height: 1, width: 1 }, thickness: 0.15 },
    }),
  })

const pad = (number: string, x: number, net: PcbNet) =>
  new FootprintPad({
    number,
    padType: "smd",
    shape: "roundrect",
    at: new At([x, 0]),
    size: new PadSize(1.05, 0.95),
    layers: new PadLayers(["F.Cu", "F.Paste", "F.Mask"]),
    roundrectRatio: 0.25,
    net: new PadNet(net.id, net.name),
    pinfunction: number,
    pintype: "passive",
  })

const pcb = new KicadPcb({
  version: 20240101,
  generator: "kicadts-demo",
  nets: [netGnd, netSignal],
  footprints: [
    new Footprint({
      libraryLink: "Resistor_SMD:R_0603",
      layer: "F.Cu",
      position: new At([10, 5, 90]),
      fpTexts: [
        makeText("reference", "R1", 0, -1.5, "F.SilkS"),
        makeText("value", "10k", 0, 1.5, "F.Fab"),
      ],
      fpPads: [pad("1", -0.8, netGnd), pad("2", 0.8, netSignal)],
    }),
  ],
})

await fs.writeFile("demo.kicad_pcb", pcb.getString())
```

## Build Stand-Alone Footprints

Footprints can live outside a board file (for library `.kicad_mod` entries). Populate `Footprint` and write the S-expression to disk.

```ts
import { promises as fs } from "node:fs"
import {
  At,
  Footprint,
  FootprintPad,
  FpText,
  PadLayers,
  PadSize,
  TextEffects,
} from "kicadts"

const footprint = new Footprint({
  libraryLink: "Demo:TestPad",
  layer: "F.Cu",
  position: new At([0, 0]),
  fpTexts: [
    new FpText({
      type: "reference",
      text: "REF**",
      position: new At([0, -1.5]),
      layer: "F.SilkS",
      effects: new TextEffects({
        font: { size: { height: 1, width: 1 }, thickness: 0.15 },
      }),
    }),
  ],
  fpPads: [
    new FootprintPad({
      number: "1",
      padType: "smd",
      shape: "rect",
      at: new At([0, 0]),
      size: new PadSize(1.5, 1.5),
      layers: new PadLayers(["F.Cu", "F.Paste", "F.Mask"]),
    }),
  ],
})

await fs.writeFile("Demo_TestPad.kicad_mod", footprint.getString())
```

## Load Existing KiCad Files

Parsing works for schematics, boards, footprints, or any KiCad S-expression. `parseKicadSexpr` returns an array of `SxClass` instances; narrow to the concrete class with `instanceof` and mutate as needed.

```ts
import { promises as fs } from "node:fs"
import { KicadPcb, KicadSch, Footprint, parseKicadSexpr } from "kicadts"

const load = async (path: string) => {
  const raw = await fs.readFile(path, "utf8")
  const [root] = parseKicadSexpr(raw)

  if (root instanceof KicadSch) {
    root.generator = "kicadts"
    return root
  }

  if (root instanceof KicadPcb) {
    root.generatorVersion = "(generated programmatically)"
    return root
  }

  if (root instanceof Footprint) {
    root.descr = "Imported with kicadts"
    return root
  }

  throw new Error(`Unsupported root token: ${root.token}`)
}

const updated = await load("existing.kicad_sch")
await fs.writeFile("existing.kicad_sch", updated.getString())
```

Any class exposes `getChildren()` if you need to walk the tree manually, and snapshot tests (`bun test`) ensure the emitted S-expression stays identical to KiCad’s own formatting.
