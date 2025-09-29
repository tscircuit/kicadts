// s_expr_parser.ts
export type PrimitiveSExpr =
  | string // symbols and string literals (distinct via `type` guard if you want)
  | number
  | boolean
  | null
  | PrimitiveSExpr[] // lists

type Token =
  | { type: "lparen" }
  | { type: "rparen" }
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "nil" }
  | { type: "symbol"; value: string }

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  const isWhitespace = (ch: string) => /\s/.test(ch)
  const isSymbolInitial = (ch: string) => /[^\s()"]/u.test(ch) // anything except ws, parens, quote
  const peek = () => (i < input.length ? input[i]! : undefined)
  const advance = () => {
    if (i >= input.length) {
      throw new SyntaxError("Unexpected end of input")
    }
    return input[i++]!
  }

  while (i < input.length) {
    const ch = peek()
    if (ch === undefined) {
      break
    }
    const current: string = ch

    // Skip whitespace
    if (isWhitespace(current)) {
      i++
      continue
    }

    // Comments ;...<EOL>
    if (current === ";") {
      while (i < input.length && input[i] !== "\n") i++
      continue
    }

    if (current === "(") {
      tokens.push({ type: "lparen" })
      i++
      continue
    }
    if (current === ")") {
      tokens.push({ type: "rparen" })
      i++
      continue
    }

    // String literal
    if (current === '"') {
      i++ // skip opening quote
      let out = ""
      while (i < input.length) {
        const c = advance()
        if (c === '"') break
        if (c === "\\") {
          if (i >= input.length)
            throw new SyntaxError("Unterminated escape in string")
          const e = advance()
          switch (e) {
            case "n":
              out += "\n"
              break
            case "r":
              out += "\r"
              break
            case "t":
              out += "\t"
              break
            case '"':
              out += '"'
              break
            case "\\":
              out += "\\"
              break
            default:
              out += e
              break // unknown escapes: keep raw
          }
        } else {
          out += c
        }
      }
      if (input[i - 1] !== '"')
        throw new SyntaxError("Unterminated string literal")
      tokens.push({ type: "string", value: out })
      continue
    }

    // Number or symbol
    if (isSymbolInitial(current) || current === "-" || current === "+" || current === ".") {
      // read a maximal token until delimiter
      let start = i
      while (i < input.length) {
        const nextChar = input[i]!
        if (
          isWhitespace(nextChar) ||
          nextChar === "(" ||
          nextChar === ")" ||
          nextChar === '"'
        ) {
          break
        }
        i++
      }
      const raw = input.slice(start, i)

      // Booleans
      if (raw === "#t") {
        tokens.push({ type: "boolean", value: true })
        continue
      }
      if (raw === "#f") {
        tokens.push({ type: "boolean", value: false })
        continue
      }

      // nil
      if (raw === "nil") {
        tokens.push({ type: "nil" })
        continue
      }

      // Numbers (int/float), allow leading +/-, decimals, exponent
      if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/u.test(raw)) {
        tokens.push({ type: "number", value: Number(raw) })
      } else {
        tokens.push({ type: "symbol", value: raw })
      }
      continue
    }

    throw new SyntaxError(`Unexpected character: ${JSON.stringify(ch)} at ${i}`)
  }

  return tokens
}

export function parseToPrimitiveSExpr(input: string): PrimitiveSExpr[] {
  const toks = tokenize(input)
  let idx = 0

  const peekToken = () => (idx < toks.length ? toks[idx]! : undefined)
  const advanceToken = () => {
    if (idx >= toks.length) {
      throw new SyntaxError("Unexpected end of input")
    }
    return toks[idx++]!
  }

  function readForm(): PrimitiveSExpr {
    const t = advanceToken()

    switch (t.type) {
      case "lparen": {
        const list: PrimitiveSExpr[] = []
        while (true) {
          const next = peekToken()
          if (!next) {
            throw new SyntaxError("Unmatched '('")
          }
          if (next.type === "rparen") break
          list.push(readForm())
        }
        advanceToken() // consume rparen
        return list
      }
      case "rparen":
        throw new SyntaxError("Unmatched ')'")
      case "number":
        return t.value
      case "string":
        return t.value
      case "boolean":
        return t.value
      case "nil":
        return null
      case "symbol":
        return t.value // represent symbols as strings
    }
  }

  const forms: PrimitiveSExpr[] = []
  while (peekToken()) forms.push(readForm())
  return forms
}

/* -------------------------
   Tiny helper utilities
--------------------------*/

export function printSExpr(x: PrimitiveSExpr): string {
  if (x === null) return "nil"
  if (typeof x === "boolean") return x ? "#t" : "#f"
  if (typeof x === "number") return Number.isFinite(x) ? String(x) : "nan"
  if (typeof x === "string") {
    // naive: treat as symbol if it looks like a symbol; otherwise quote
    if (/^[^\s()"]+$/u.test(x) && x !== "nil" && x !== "#t" && x !== "#f")
      return x
    return `"${x.replace(/["\\\n\r\t]/g, (m) =>
      m === '"'
        ? '\\"'
        : m === "\\"
          ? "\\\\"
          : m === "\n"
            ? "\\n"
            : m === "\r"
              ? "\\r"
              : "\\t",
    )}"`
  }
  if (Array.isArray(x)) {
    return `(${x.map(printSExpr).join(" ")})`
  }

  throw new Error(`Unsupported S-expression value: ${JSON.stringify(x)}`)
}

// Quick example:
// const program = `
//   ; define square
//   (define (square x) (* x x))
//   (list 1 2.5 "hi" #t nil foo-bar)
// `;
// const ast = parseSExpr(program);
// console.log(JSON.stringify(ast, null, 2));
// console.log(ast.map(printSExpr).join("\n"));
