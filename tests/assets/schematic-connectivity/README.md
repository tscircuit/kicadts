These small schematics exercise electrical attachment rules independently of
the TypeScript resolver. `native-nets.json` records their pin memberships from
KiCad 10.0.7's native netlist exporter:

```sh
kicad-cli sch export netlist --format kicadsexpr \
  --output crossing-junction.net crossing-junction.kicad_sch
```

The expected JSON keeps each net's sorted `reference.pin` members, including
isolated pins. Names and net codes are omitted because this utility returns
source labels and its own result IDs rather than generating KiCad net names.
The tests read the committed expectations and do not require KiCad to run.
