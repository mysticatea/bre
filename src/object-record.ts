import { getAccessor } from "./internal/accessor-registry"
import assert from "./internal/assert"
import { Record } from "./internal/record"
import { Accessor } from "./internal/types"
import {
    DataType,
    ObjectRecordConstructor,
    PropertyTypeOf as PropertyTypeOf_,
} from "./types"

const VALID_RECORD_NAME = /^[A-Z][a-zA-Z0-9_$]*$/
const INVALID_FIELD_NAME = /^(?:__(?:(?:define|lookup)(?:G|S)etter|proto|noSuchMethod)__|constructor|hasOwnProperty|isPrototypeOf|propertyIsEnumerable|to(?:JSON|LocaleString|String)|valueOf)$/

interface ConcreteFieldDefinition {
    name: string
    accessor: Accessor<any>
    bitOffset: number
}

const ObjectRecordBase = class ObjectRecord extends Record {
    toJSON() {
        const record = this as any
        const obj = {} as any
        for (const key of record.constructor.keys()) {
            obj[key] = record[key]
        }
        return obj
    }
}

function isDataTypeWithOffset(type: any): type is DataTypeWithOffset {
    return (
        typeof type === "object" &&
        typeof type.type !== "undefined" &&
        (typeof type.byteLength === "undefined" ||
            typeof type.byteLength === "number")
    )
}

function keysCode(fields: ReadonlyArray<ConcreteFieldDefinition>) {
    let s = `return [\n`
    for (let i = 0; i < fields.length; ++i) {
        s += '    "'
        s += fields[i].name
        s += '",\n'
    }
    s += "]"

    return s
}

function valuesCode(fields: ReadonlyArray<ConcreteFieldDefinition>) {
    let s = `return [\n`
    for (let i = 0; i < fields.length; ++i) {
        s += "    record."
        s += fields[i].name
        s += ",\n"
    }
    s += "]"

    return s
}

function entriesCode(fields: ReadonlyArray<ConcreteFieldDefinition>) {
    let s = `return [\n`
    for (let i = 0; i < fields.length; ++i) {
        s += '    ["'
        s += fields[i].name
        s += '", record.'
        s += fields[i].name
        s += "],\n"
    }
    s += "]"

    return s
}

function defineObjectRecord0(
    className: string,
    bitLength: number,
    fields: ReadonlyArray<ConcreteFieldDefinition>,
    extraMembers: { [key: string]: any },
) {
    const byteLength = (bitLength >> 3) + (bitLength & 0x07 ? 1 : 0)
    const ObjectRecord = Function(
        "ObjectRecord",
        `return class ${className} extends ObjectRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset, ${byteLength})
    }

    static view(buffer, byteOffset = 0) {
        return Object.freeze(new this(buffer, byteOffset))
    }

    static get bitLength() {
        return ${bitLength}
    }

    static get byteLength() {
        return ${byteLength}
    }

    static keys(record) {
        ${keysCode(fields)}
    }

    static values(record) {
        ${valuesCode(fields)}
    }

    static entries(record) {
        ${entriesCode(fields)}
    }
}`,
    )(ObjectRecordBase)

    for (const { accessor, bitOffset, name } of fields) {
        Object.defineProperty(ObjectRecord.prototype, name, {
            get: accessor.defineGet(name, bitOffset),
            set: accessor.defineSet(name, bitOffset),
            configurable: true,
            enumerable: true,
        })
    }
    for (const key of Object.keys(extraMembers)) {
        Object.defineProperty(ObjectRecord.prototype, key, {
            value: extraMembers[key],
            configurable: true,
            writable: true,
        })
    }

    return ObjectRecord
}

export interface DataTypeWithOffset<T extends DataType = DataType> {
    type: T
    bitOffset?: number
}

export type PropertyTypeOf<T> = T extends DataType
    ? PropertyTypeOf_<T>
    : T extends DataTypeWithOffset<infer TT> ? PropertyTypeOf_<TT> : never
export type RecordTypeOf<T> = { [P in keyof T]: PropertyTypeOf<T[P]> }

export function defineObjectRecord<
    T extends { [fieldName: string]: DataType | DataTypeWithOffset },
    U extends { [key: string]: any }
>(
    className: string,
    shape: T,
    options: { bitLength?: number; extraMembers?: U },
): ObjectRecordConstructor<RecordTypeOf<T> & U>
export function defineObjectRecord<
    T extends { [fieldName: string]: DataType | DataTypeWithOffset }
>(className: string, shape: T): ObjectRecordConstructor<RecordTypeOf<T>>

export function defineObjectRecord<
    T extends { [fieldName: string]: DataType | DataTypeWithOffset }
>(
    className: string,
    shape: T,
    {
        bitLength = undefined,
        extraMembers = {},
    }: { bitLength?: number; extraMembers?: { [key: string]: any } } = {},
): ObjectRecordConstructor<RecordTypeOf<T>> {
    assert.string(className, "className")
    assert(
        VALID_RECORD_NAME.test(className),
        `'className' should be a PascalCase Identifier, but got ${JSON.stringify(
            className,
        )}.`,
    )
    assert.object(shape, "shape")

    let bitOffset = 0
    const fields = Object.keys(shape).map(name => {
        assert(
            !INVALID_FIELD_NAME.test(name),
            `The name of 'shape.${name}' property should NOT be a forbidden name "${name}".`,
        )
        const fieldDef = shape[name]

        let field: ConcreteFieldDefinition
        if (isDataTypeWithOffset(fieldDef)) {
            const { type, bitOffset: newBitOffset } = fieldDef
            const accessor = getAccessor(type)

            if (typeof newBitOffset === "number") {
                assert.integer(newBitOffset, `shape.${name}.type`)
                assert.gte(newBitOffset, bitOffset, `shape.${name}.type`)
                bitOffset = newBitOffset
            }

            field = { name, accessor, bitOffset }
        } else {
            const accessor = getAccessor(fieldDef)
            field = { name, accessor, bitOffset }
        }

        bitOffset += field.accessor.bits
        return field
    })

    if (typeof bitLength === "number") {
        assert(
            bitLength >= bitOffset,
            "'options.bitLength' should not be less than the size of 'shape'.",
        )
        bitOffset = bitLength
    }

    return defineObjectRecord0(className, bitOffset, fields, extraMembers)
}
