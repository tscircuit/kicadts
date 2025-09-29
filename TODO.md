# TODO: Ergonomic Constructors

The following classes need ergonomic constructors created (similar to the pattern in `KicadSch.ts`):

## Main Container Classes

- [x] **KicadSch** - `lib/sexpr/classes/KicadSch.ts`
- [ ] **Bus** - `lib/sexpr/classes/Bus.ts`
- [ ] **BusEntry** - `lib/sexpr/classes/BusEntry.ts`
- [ ] **Footprint** - `lib/sexpr/classes/Footprint.ts`
- [ ] **FootprintPad** - `lib/sexpr/classes/FootprintPad.ts`
- [ ] **FpArc** - `lib/sexpr/classes/FpArc.ts`
- [ ] **FpCircle** - `lib/sexpr/classes/FpCircle.ts`
- [ ] **FpLine** - `lib/sexpr/classes/FpLine.ts`
- [ ] **FpPoly** - `lib/sexpr/classes/FpPoly.ts`
- [ ] **FpRect** - `lib/sexpr/classes/FpRect.ts`
- [ ] **FpText** - `lib/sexpr/classes/FpText.ts`
- [ ] **FpTextBox** - `lib/sexpr/classes/FpTextBox.ts`
- [ ] **GrLine** - `lib/sexpr/classes/GrLine.ts`
- [ ] **GrText** - `lib/sexpr/classes/GrText.ts`
- [ ] **Image** - `lib/sexpr/classes/Image.ts`
- [ ] **Junction** - `lib/sexpr/classes/Junction.ts`
- [ ] **KicadPcb** - `lib/sexpr/classes/KicadPcb.ts`
- [ ] **Label** - `lib/sexpr/classes/Label.ts`
- [ ] **NoConnect** - `lib/sexpr/classes/NoConnect.ts`
- [ ] **PadPrimitiveGrArc** - `lib/sexpr/classes/PadPrimitiveGrArc.ts`
- [ ] **PadPrimitiveGrCircle** - `lib/sexpr/classes/PadPrimitiveGrCircle.ts`
- [ ] **Property** - `lib/sexpr/classes/Property.ts`
- [ ] **SchematicText** - `lib/sexpr/classes/SchematicText.ts`
- [ ] **Segment** - `lib/sexpr/classes/Segment.ts`
- [ ] **Sheet** - `lib/sexpr/classes/Sheet.ts`
- [ ] **Symbol** (SchematicSymbol) - `lib/sexpr/classes/Symbol.ts`
- [ ] **TextEffects** - `lib/sexpr/classes/TextEffects.ts`
- [ ] **TitleBlock** - `lib/sexpr/classes/TitleBlock.ts`
- [ ] **Via** - `lib/sexpr/classes/Via.ts`
- [ ] **Wire** - `lib/sexpr/classes/Wire.ts`

## Pattern Requirements

Each class needs:
1. A TypeScript interface `{ClassName}ConstructorParams` with optional properties
2. Properties should accept either primitive values (strings, numbers) OR SxClass wrapper objects
3. Constructor that accepts the params interface and handles both cases
4. Getter/setter pairs working with primitive values while storing SxClass objects internally

See `lib/sexpr/classes/KicadSch.ts` for reference implementation.