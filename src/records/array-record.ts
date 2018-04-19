import assert from "../assert"
import {
    Accessor,
    AccessorOf,
    AccessorDataTypeOf,
    DataType,
    getAccessor,
} from "../accessor-registry"
import { getTextEncoder } from "../text-encoder-registry"
import { ArrayRecordConstructor } from "../types"
import { Record, sBuffer, uid } from "./record"

const instances = new Map<string, ArrayRecordConstructor<any>>()
const ArrayRecord = (() => {
    //eslint-disable-next-line no-shadow
    class ArrayRecord extends Record {
        *values() {
            const self = this as any
            const len = self.length
            for (let i = 0; i < len; ++i) {
                yield self[i]
            }
        }

        [Symbol.iterator]() {
            return this.values()
        }

        toJSON() {
            return Array.from(this)
        }
    }

    for (const key of [
        "concat",
        "copyWithin",
        "entries",
        "every",
        "fill",
        "filter",
        "find",
        "findIndex",
        "forEach",
        "includes",
        "indexOf",
        "join",
        "keys",
        "lastIndexOf",
        "map",
        "reduce",
        "reduceRight",
        "reverse",
        "slice",
        "some",
        "sort",
        "values",
    ]) {
        const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, key)
        if (descriptor) {
            Object.defineProperty(ArrayRecord.prototype, key, descriptor)
        }
    }

    return ArrayRecord
})()

function propertiesCode(accessor: Accessor<any>, length: number): string {
    if (length === 0) {
        return ""
    }

    let s = accessor.propertyCode(0, 0)
    for (let i = 1; i < length; ++i) {
        s += "\n"
        s += accessor.propertyCode(i, i * accessor.bits)
    }
    return s
}

function defineArrayRecord0<T extends DataType>(
    accessor: AccessorOf<T>,
    length: number,
): ArrayRecordConstructor<AccessorDataTypeOf<T>> {
    const className = `ArrayRecord$${accessor.name}$${length}`
    const bitLength = accessor.bits * length
    const byteLength = (bitLength >> 3) + (bitLength & 0x07 ? 1 : 0)
    const textEncoder = getTextEncoder()
    const records = accessor.subRecord ? [accessor.subRecord] : []
    const uids = records.map(record => record.uid)
    const definitionBody = `return class ${className} extends ArrayRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset, ${byteLength})
    }

    static view(buffer, byteOffset = 0) {
        return Object.freeze(new ${className}(buffer, byteOffset))
    }

    static get uid() {
        return ${JSON.stringify(uid())}
    }

    static get name() {
        return ${JSON.stringify(className)}
    }

    static get bitLength() {
        return ${bitLength}
    }

    static get byteLength() {
        return ${byteLength}
    }

    get length() {
        return ${length}
    }

    ${propertiesCode(accessor, length)}
}`
    try {
        return Function(
            "ArrayRecord",
            "TextEncoder",
            "assert",
            "sBuffer",
            ...uids,
            definitionBody,
        )(ArrayRecord, textEncoder, assert, sBuffer, ...records)
    } catch (err) {
        console.error("******** FAILED TO COMPILE ********")
        console.error(definitionBody)
        throw err
    }
}

export function defineArrayRecord<T extends DataType>(
    elementType: T,
    length: number,
): ArrayRecordConstructor<AccessorDataTypeOf<T>> {
    assert.integer(length, "length")
    assert.gte(length, 0, "length")

    const accessor = getAccessor(elementType)
    const key = `${length === 0 ? "" : accessor.name}$${length}`
    let retv:
        | ArrayRecordConstructor<AccessorDataTypeOf<T>>
        | undefined = instances.get(key)

    if (retv == null) {
        retv = defineArrayRecord0(accessor, length)
        instances.set(key, retv)
    }

    return retv
}
