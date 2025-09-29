import { expect } from "bun:test"
import type { PrimitiveSExpr } from "lib/sexpr/parseToPrimitiveSExpr"

interface ExpectEqualPrimitiveSExprOptions {
  context?: Record<string, unknown>
  path?: string
}

type CanonicalPrimitiveSExpr =
  | string
  | number
  | boolean
  | null
  | CanonicalPrimitiveSExpr[]

const ORDERED_TAGS = new Set(["xy"])

const canonicalKey = (value: CanonicalPrimitiveSExpr): string =>
  JSON.stringify(value)

const canonicalizePrimitiveSExpr = (
  value: PrimitiveSExpr,
): CanonicalPrimitiveSExpr => {
  if (!Array.isArray(value)) {
    return value
  }

  if (value.length === 0) {
    return []
  }

  const first = value[0]

  if (typeof first === "string") {
    return canonicalizeNode(value as CanonicalPrimitiveSExpr[])
  }

  if (Array.isArray(first)) {
    const canonicalChildren = value.map((child) =>
      canonicalizePrimitiveSExpr(child),
    ) as CanonicalPrimitiveSExpr[]

    canonicalChildren.sort((a, b) =>
      canonicalKey(a).localeCompare(canonicalKey(b)),
    )

    return canonicalChildren
  }

  return value.map((child) => canonicalizePrimitiveSExpr(child))
}

const canonicalizeNode = (
  list: CanonicalPrimitiveSExpr[],
): CanonicalPrimitiveSExpr => {
  const [head, ...tail] = list

  if (head === undefined) {
    return []
  }

  const positional: CanonicalPrimitiveSExpr[] = []
  const grouped = new Map<string, CanonicalPrimitiveSExpr[]>()

  for (const element of tail) {
    if (Array.isArray(element)) {
      const tag = element[0]
      if (typeof tag === "string" && !ORDERED_TAGS.has(tag)) {
        const canonicalChild = canonicalizePrimitiveSExpr(element)
        const bucket = grouped.get(tag)
        if (bucket) {
          bucket.push(canonicalChild)
        } else {
          grouped.set(tag, [canonicalChild])
        }
        continue
      }
    }

    positional.push(canonicalizePrimitiveSExpr(element))
  }

  const groupedValues: CanonicalPrimitiveSExpr[] = []
  const sortedTags = [...grouped.keys()].sort()
  for (const tag of sortedTags) {
    const items = grouped.get(tag)!
    items.sort((a, b) => canonicalKey(a).localeCompare(canonicalKey(b)))
    groupedValues.push(...items)
  }

  return [canonicalizePrimitiveSExpr(head), ...positional, ...groupedValues]
}

export const expectEqualPrimitiveSExpr = (
  actual: PrimitiveSExpr,
  expected: PrimitiveSExpr,
  options: ExpectEqualPrimitiveSExprOptions = {},
): void => {
  const normalizedActual = canonicalizePrimitiveSExpr(actual)
  const normalizedExpected = canonicalizePrimitiveSExpr(expected)

  const metadata =
    options.context ?? (options.path ? { path: options.path } : undefined)

  if (metadata) {
    expect({ ...metadata, sexpr: normalizedActual }).toEqual({
      ...metadata,
      sexpr: normalizedExpected,
    })
    return
  }

  expect(normalizedActual).toEqual(normalizedExpected)
}
