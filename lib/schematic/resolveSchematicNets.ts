import type { KicadSch } from "../sexpr/classes/KicadSch"
import { Xy } from "../sexpr/classes/Xy"
import {
  getSchematicPinPosition,
  getSchematicSymbolPins,
} from "./getSchematicSymbolPins"
import type {
  ResolvedSchematicNet,
  ResolvedSchematicPin,
  SchematicConnectivityPoint,
  SchematicNetResolution,
} from "./types"

const pointKey = ({ x, y }: SchematicConnectivityPoint): string =>
  `${Math.round(x * 1e6)},${Math.round(y * 1e6)}`
const decodeNetName = (name: string): string => name.replaceAll("{slash}", "/")

/**
 * Resolve scalar electrical nets on one sheet from parsed KiCad objects.
 * Does not mutate the schematic, run ERC, or traverse child sheets.
 */
export function resolveSchematicNets(
  schematic: KicadSch,
): SchematicNetResolution {
  const warnings: string[] = []
  if (schematic.sheets.length > 0) {
    warnings.push(
      "Child sheets are not traversed; only this sheet is resolved.",
    )
  }
  const parents = new Map<string, string>()
  const addPoint = (point: SchematicConnectivityPoint): string => {
    const key = pointKey(point)
    if (!parents.has(key)) parents.set(key, key)
    return key
  }
  const root = (key: string): string => {
    let current = key
    while (current !== parents.get(current)) {
      const parent = parents.get(current)!
      const grandparent = parents.get(parent)!
      parents.set(current, grandparent)
      current = grandparent
    }
    return current
  }
  const connect = (a: string, b: string) => parents.set(root(b), root(a))

  const wirePoints = new Map(
    schematic.wires.flatMap((wire) => {
      const points = wire.points?.points
      if (
        !points ||
        points.length < 2 ||
        !points.every((p) => p instanceof Xy)
      ) {
        warnings.push(
          `Wire ${wire.uuid?.value ?? "without UUID"} has no valid endpoints.`,
        )
        return []
      }
      for (let i = 1; i < points.length; i++) {
        connect(addPoint(points[i - 1]!), addPoint(points[i]!))
      }
      return [[wire, points] as const]
    }),
  )

  const junctions = schematic.junctions.filter((junction) => junction.at)
  const labels = [...schematic.labels, ...schematic.globalLabels].filter(
    (label) => label.at && label.value,
  )
  // A T-shaped wire endpoint or a pin in another wire's interior does not
  // establish a connection. Junctions and labels can attach inside a segment.
  for (const item of [...junctions, ...labels]) {
    const key = addPoint(item.at!)
    for (const points of wirePoints.values()) {
      for (let i = 1; i < points.length; i++) {
        if (pointOnSegment(item.at!, points[i - 1]!, points[i]!)) {
          connect(key, pointKey(points[i - 1]!))
        }
      }
    }
  }

  const namedPoints = labels.map((label) => ({
    name: decodeNetName(label.value),
    key: pointKey(label.at!),
  }))
  const noConnectPositions = new Set(
    schematic.noConnects.flatMap((marker) =>
      marker.at ? [pointKey(marker.at)] : [],
    ),
  )
  const libraries = new Map(
    schematic.libSymbols?.symbols.map((library) => [
      library.libraryId,
      library,
    ]),
  )
  const pins: ResolvedSchematicPin[] = []
  for (const symbol of schematic.symbols) {
    const library = libraries.get(symbol.libraryId)
    if (!library || !symbol.at) {
      warnings.push(
        `Symbol ${symbol.uuid ?? symbol.libraryId ?? "without UUID"} has no embedded library or placement; pins were not resolved.`,
      )
      continue
    }
    const definitions = getSchematicSymbolPins(library, symbol)
    for (const pin of definitions) {
      if (!pin.at) {
        warnings.push(
          `Pin ${pin.numberString ?? "without number"} of ${symbol.libraryId} has no position.`,
        )
        continue
      }
      const position = getSchematicPinPosition(symbol, pin)
      const key = addPoint(position)
      pins.push({
        symbol,
        pin,
        position,
        isNoConnect:
          pin.pinElectricalType === "no_connect" || noConnectPositions.has(key),
      })
      if (pin.pinElectricalType !== "power_in") continue
      // Power symbols name their net by Value. PWR_FLAG has a power_out pin
      // and must not create an implicit named connection.
      const powerName =
        library._sxPower && definitions.length === 1
          ? symbol.properties.find((property) => property.key === "Value")
              ?.value
          : pin.hidden
            ? pin.name
            : undefined
      if (powerName && powerName !== "~") {
        namedPoints.push({ name: decodeNetName(powerName), key })
      }
    }
  }

  const firstPointByName = new Map<string, string>()
  for (const { name, key } of namedPoints) {
    const first = firstPointByName.get(name)
    if (first) connect(first, key)
    else firstPointByName.set(name, key)
  }

  const groups = new Map<string, ResolvedSchematicNet>()
  const groupAt = (point: SchematicConnectivityPoint): ResolvedSchematicNet => {
    const key = root(pointKey(point))
    let group = groups.get(key)
    if (!group) {
      group = {
        id: `net_${groups.size}`,
        names: [],
        wires: [],
        pins: [],
        labels: [],
        junctions: [],
      }
      groups.set(key, group)
    }
    return group
  }
  for (const [wire, points] of wirePoints) groupAt(points[0]!).wires.push(wire)
  for (const pin of pins) groupAt(pin.position).pins.push(pin)
  for (const label of labels) groupAt(label.at!).labels.push(label)
  for (const junction of junctions)
    groupAt(junction.at!).junctions.push(junction)
  for (const { name, key } of namedPoints) {
    const group = groups.get(root(key))!
    if (!group.names.includes(name)) group.names.push(name)
  }
  return { nets: [...groups.values()], warnings }
}

const pointOnSegment = (
  point: SchematicConnectivityPoint,
  from: SchematicConnectivityPoint,
  to: SchematicConnectivityPoint,
): boolean => {
  const x = Math.round(point.x * 1e6)
  const y = Math.round(point.y * 1e6)
  const x1 = Math.round(from.x * 1e6)
  const y1 = Math.round(from.y * 1e6)
  const x2 = Math.round(to.x * 1e6)
  const y2 = Math.round(to.y * 1e6)
  if (
    x < Math.min(x1, x2) ||
    x > Math.max(x1, x2) ||
    y < Math.min(y1, y2) ||
    y > Math.max(y1, y2)
  )
    return false
  // Use KiCad's nanometer grid, including exact collinearity for diagonal
  // wires. BigInt avoids rounding large integer cross products.
  return BigInt(x - x1) * BigInt(y2 - y1) === BigInt(y - y1) * BigInt(x2 - x1)
}
