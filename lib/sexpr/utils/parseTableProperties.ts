import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"

export const parseTableProperties = (
  primitives: PrimitiveSExpr[],
  parentToken: string,
  supportedTokens: string[],
  repeatedTokens: string[] = [],
) => {
  for (const primitive of primitives) {
    if (!Array.isArray(primitive) || typeof primitive[0] !== "string") {
      throw new Error(`${parentToken} requires child expressions`)
    }
  }
  const properties = SxClass.parsePrimitivesToClassProperties(
    primitives,
    parentToken,
  )
  for (const [token, entries] of Object.entries(properties.arrayPropertyMap)) {
    if (!supportedTokens.includes(token)) {
      throw new Error(
        `${parentToken} encountered unsupported child token "${token}"`,
      )
    }
    if (entries.length > 1 && !repeatedTokens.includes(token)) {
      throw new Error(
        `${parentToken} does not support repeated child token "${token}"`,
      )
    }
  }
  return properties
}
