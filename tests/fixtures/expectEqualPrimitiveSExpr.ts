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

  const rootPath = options.path ?? "sexpr"
  const contextEntries = options.context ? Object.entries(options.context) : []

  const formatPath = (segments: readonly string[]): string => segments.join("")

  const buildPayload = (
    path: string,
    value: unknown,
  ): Record<string, unknown> => {
    if (contextEntries.length === 0) {
      return { path, value }
    }

    const payload: Record<string, unknown> = {}
    for (const [key, contextValue] of contextEntries) {
      payload[key] = contextValue
    }
    payload.path = path
    payload.value = value
    return payload
  }

  const expectWithPath = (
    segments: readonly string[],
    actualValue: unknown,
    expectedValue: unknown,
  ): void => {
    const path = formatPath(segments)
    expect(buildPayload(path, actualValue)).toEqual(
      buildPayload(path, expectedValue),
    )
  }

  const getNodeToken = (value: CanonicalPrimitiveSExpr): string | undefined => {
    if (!Array.isArray(value)) {
      return undefined
    }

    const [head] = value
    return typeof head === "string" ? head : undefined
  }

  const describePathSegment = (
    child: CanonicalPrimitiveSExpr,
    index: number,
  ): string => {
    const token = getNodeToken(child)
    if (token) {
      return `[${index}:${token}]`
    }
    return `[${index}]`
  }

  const describeType = (value: CanonicalPrimitiveSExpr): string => {
    if (Array.isArray(value)) {
      return "array"
    }
    if (value === null) {
      return "null"
    }
    return typeof value
  }

  const compare = (
    currentActual: CanonicalPrimitiveSExpr,
    currentExpected: CanonicalPrimitiveSExpr,
    path: readonly string[],
  ): void => {
    const actualType = describeType(currentActual)
    const expectedType = describeType(currentExpected)

    if (actualType !== expectedType) {
      expectWithPath([...path, ".type"], actualType, expectedType)
      return
    }

    if (Array.isArray(currentActual) && Array.isArray(currentExpected)) {
      expectWithPath(
        [...path, ".length"],
        currentActual.length,
        currentExpected.length,
      )

      const limit = Math.min(currentActual.length, currentExpected.length)
      for (let index = 0; index < limit; index += 1) {
        const childActual = currentActual[index]!
        const childExpected = currentExpected[index]!
        const childSegment = describePathSegment(childActual, index)
        compare(childActual, childExpected, [...path, childSegment])
      }
      return
    }

    expectWithPath(path, currentActual, currentExpected)
  }

  compare(normalizedActual, normalizedExpected, [rootPath])
}
