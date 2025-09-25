This is the `kicadts` typescript library. It's still in early developement and
we're trying to make sure we parse the entire KiCad S-expression specification.

You can find the difference specifications in the `references` directory, the
most extensive one is `references/SEXPR_MAIN.adoc` (use `bun run scripts/download-references.ts` to download if it's not already there)

- `references/SCHEMATIC_SEXPR.adoc`
- `references/PCB_SEXPR.adoc`
- `references/FOOTPRINT_SEXPR.adoc`
- `references/SCH_SYM_SEXPR.adoc`
- `references/SEXPR_MAIN.adoc`

### Tips

- Every S-expression token must have a corresponding `SxClass` subclass and be registered via `SxClass.register`; missing registrations cause parse failures.
- Tokens reused under different parents (for example `type` under `stroke`) require `static parentToken` overrides so the correct class resolves during parsing.
- When a class accepts unordered child tokens, set `_propertyMap` using `loadProperties` to make getters convenient and keep `getString()` deterministic.
- Snapshot tests with `bun test` provide quick verification that `getString()` matches the KiCad formatting expectations.

### Major Refactor Notice

- The code in this repo is only partially migrated to the new pattern
- NEW PATTERN: Constructors never take `PrimitiveSExpr` arguments
- NEW PATTERN: All classes have a `fromSexprPrimitives` static method that takes a `PrimitiveSExpr` array and returns an instance of the class
- NEW PATTERN: Classes have ergonomic getters and setters for properties
- NEW PATTERN: Never has "extras" property, everything becomes an `SxClass`
