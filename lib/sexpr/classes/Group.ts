import { SxClass } from "../base-classes/SxClass"
import type { PrimitiveSExpr } from "../parseToPrimitiveSExpr"
import { Uuid } from "./Uuid"
import { toStringValue } from "../utils/toStringValue"

export interface GroupConstructorParams {
  name?: string
  uuid?: string | Uuid
  locked?: boolean
  members?: string[]
}

const SUPPORTED_SINGLE_TOKENS = new Set(["uuid", "locked", "members"])

export class Group extends SxClass {
  static override token = "group"
  override token = "group"

  private _name: string = ""
  private _sxUuid?: Uuid
  private _sxLocked?: GroupLocked
  private _sxMembers?: GroupMembers

  constructor(params: GroupConstructorParams = {}) {
    super()
    if (params.name !== undefined) this.name = params.name
    if (params.uuid !== undefined) this.uuid = params.uuid
    if (params.locked !== undefined) this.locked = params.locked
    if (params.members !== undefined) this.members = params.members
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): Group {
    const group = new Group()

    // First primitive is the name (string)
    if (primitiveSexprs.length > 0 && typeof primitiveSexprs[0] === "string") {
      group._name = primitiveSexprs[0]
    }

    const { propertyMap, arrayPropertyMap } =
      SxClass.parsePrimitivesToClassProperties(
        primitiveSexprs.slice(1),
        this.token,
      )

    const unexpectedTokens = new Set<string>()
    for (const token of Object.keys(propertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        unexpectedTokens.add(token)
      }
    }
    for (const token of Object.keys(arrayPropertyMap)) {
      if (!SUPPORTED_SINGLE_TOKENS.has(token)) {
        unexpectedTokens.add(token)
        continue
      }
      if (arrayPropertyMap[token]!.length > 1) {
        throw new Error(
          `group does not support repeated child tokens: ${token}`,
        )
      }
    }

    if (unexpectedTokens.size > 0) {
      throw new Error(
        `Unsupported child tokens inside group expression: ${[...unexpectedTokens].join(", ")}`,
      )
    }

    for (const primitive of primitiveSexprs.slice(1)) {
      if (Array.isArray(primitive)) continue
      throw new Error(
        `group encountered unexpected primitive child: ${JSON.stringify(primitive)}`,
      )
    }

    group._sxUuid = propertyMap.uuid as Uuid | undefined
    const locked = propertyMap.locked as GroupLocked | undefined
    group._sxLocked = locked && locked.value ? locked : undefined
    group._sxMembers = propertyMap.members as GroupMembers | undefined

    return group
  }

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get uuid(): string | undefined {
    return this._sxUuid?.value
  }

  set uuid(value: string | Uuid | undefined) {
    if (value === undefined) {
      this._sxUuid = undefined
      return
    }
    this._sxUuid = value instanceof Uuid ? value : new Uuid(value)
  }

  get uuidClass(): Uuid | undefined {
    return this._sxUuid
  }

  get locked(): boolean {
    return this._sxLocked?.value ?? false
  }

  set locked(value: boolean) {
    this._sxLocked = value ? new GroupLocked(true) : undefined
  }

  get members(): string[] {
    return this._sxMembers?.members ?? []
  }

  set members(value: string[]) {
    this._sxMembers = new GroupMembers(value)
  }

  get membersClass(): GroupMembers | undefined {
    return this._sxMembers
  }

  override getChildren(): SxClass[] {
    const children: SxClass[] = []
    if (this._sxUuid) children.push(this._sxUuid)
    if (this._sxLocked) children.push(this._sxLocked)
    if (this._sxMembers) children.push(this._sxMembers)
    return children
  }

  override getString(): string {
    const lines = [`(group "${this._name}"`]
    const push = (value?: SxClass) => {
      if (!value) return
      lines.push(value.getStringIndented())
    }

    push(this._sxUuid)
    push(this._sxLocked)
    push(this._sxMembers)

    lines.push(")")
    return lines.join("\n")
  }
}
SxClass.register(Group)

export class GroupLocked extends SxClass {
  static override token = "locked"
  static override parentToken = "group"
  override token = "locked"

  value: boolean

  constructor(value: boolean) {
    super()
    this.value = value
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GroupLocked {
    if (primitiveSexprs.length === 0) {
      return new GroupLocked(true)
    }
    const state = toStringValue(primitiveSexprs[0])
    return new GroupLocked(state === "yes")
  }

  override getString(): string {
    return this.value ? "(locked yes)" : "(locked no)"
  }
}
SxClass.register(GroupLocked)

export class GroupMembers extends SxClass {
  static override token = "members"
  static override parentToken = "group"
  override token = "members"

  members: string[]

  constructor(members: string[]) {
    super()
    this.members = members
  }

  static override fromSexprPrimitives(
    primitiveSexprs: PrimitiveSExpr[],
  ): GroupMembers {
    const members: string[] = []
    for (const primitive of primitiveSexprs) {
      const str = toStringValue(primitive)
      if (str) {
        members.push(str)
      }
    }
    return new GroupMembers(members)
  }

  override getString(): string {
    if (this.members.length === 0) {
      return "(members)"
    }
    // Format members with proper indentation
    const memberStrings = this.members.map((m) => `"${m}"`).join(" ")
    return `(members ${memberStrings})`
  }
}
SxClass.register(GroupMembers)
