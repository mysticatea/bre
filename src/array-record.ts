import { getAccessor } from "./internal/accessor-registry"
import assert from "./internal/assert"
import { Record } from "./internal/record"
import { Accessor } from "./internal/types"
import { ArrayRecordConstructor, DataType, PropertyTypeOf } from "./types"

const instances = new Map<string, ArrayRecordConstructor<any>>()
const ArrayRecordBase = (() => {
    // Check for https://bugs.chromium.org/p/v8/issues/detail?id=7677
    function fillIsValid() {
        try {
            Array.prototype.fill.call(
                //eslint-disable-next-line accessor-pairs, no-empty-function
                Object.freeze({ length: 1, set 0(v: any) {} }),
            )
            return true
        } catch (_err) {
            return false
        }
    }

    // Check for https://bugs.chromium.org/p/v8/issues/detail?id=7682
    function sortIsValid() {
        try {
            const s = Symbol("s")
            class TestArrayLike {
                [s] = [2, 1]
                get 0() {
                    return this[s][0]
                }
                set 0(value) {
                    this[s][0] = value
                }
                get 1() {
                    return this[s][1]
                }
                set 1(value) {
                    this[s][1] = value
                }
                get length() {
                    return 2
                }
            }
            Array.prototype.sort.call(new TestArrayLike())
            return true
        } catch (_err) {
            return false
        }
    }

    abstract class ArrayRecord<T> extends Record {
        abstract get length(): number
        [index: number]: T

        // For `.concat()`
        [Symbol.isConcatSpreadable] = true

        // Fallback for https://bugs.chromium.org/p/v8/issues/detail?id=7677
        fill(value: T, start?: number, end?: number): this {
            if (this == null) {
                throw new TypeError("this is null or not defined")
            }
            const O = Object(this)
            const len = O.length >>> 0
            const relativeStart = (start || 0) >> 0
            const relativeEnd = end === undefined ? len : end >> 0
            const final =
                relativeEnd < 0
                    ? Math.max(len + relativeEnd, 0)
                    : Math.min(relativeEnd, len)
            let k =
                relativeStart < 0
                    ? Math.max(len + relativeStart, 0)
                    : Math.min(relativeStart, len)

            while (k < final) {
                O[k] = value
                k++
            }

            return O
        }

        // Fallback for https://bugs.chromium.org/p/v8/issues/detail?id=7682
        sort(compareFn?: (a: T, b: T) => number): this {
            const sorted = Array.from(this).sort(compareFn)
            for (let i = 0; i < sorted.length; ++i) {
                this[i] = sorted[i]
            }
            return this
        }

        // Fallback for https://bugs.chromium.org/p/v8/issues/detail?id=4247
        *values(): IterableIterator<T> {
            const O = Object(this)
            const len = O.length >>> 0
            for (let i = 0; i < len; ++i) {
                yield O[i]
            }
        }

        toJSON(): T[] {
            return Array.from(this)
        }
    }

    for (const key of [
        "concat",
        "copyWithin",
        "entries",
        "every",
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
        "values",
    ]) {
        const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, key)
        if (descriptor) {
            Object.defineProperty(ArrayRecord.prototype, key, descriptor)
        }
    }
    if (fillIsValid()) {
        const descriptor = Object.getOwnPropertyDescriptor(
            Array.prototype,
            "fill",
        )
        if (descriptor) {
            Object.defineProperty(ArrayRecord.prototype, "fill", descriptor)
        }
    }
    if (sortIsValid()) {
        const descriptor = Object.getOwnPropertyDescriptor(
            Array.prototype,
            "sort",
        )
        if (descriptor) {
            Object.defineProperty(ArrayRecord.prototype, "sort", descriptor)
        }
    }
    Object.defineProperty(
        ArrayRecord.prototype,
        Symbol.iterator,
        Object.getOwnPropertyDescriptor(ArrayRecord.prototype, "values")!,
    )

    return ArrayRecord
})()

function defineArrayRecord0<T extends DataType>(
    accessor: Accessor<any>,
    length: number,
): ArrayRecordConstructor<PropertyTypeOf<T>> {
    const className = `ArrayRecord$${accessor.name}$${length}`
    const bitLength = accessor.bits * length
    const byteLength = (bitLength >> 3) + (bitLength & 0x07 ? 1 : 0)
    const ArrayRecord = Function(
        "ArrayRecord",
        `return class ${className} extends ArrayRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset, ${byteLength})
    }

    static view(buffer, byteOffset = 0) {
        return Object.freeze(new ${className}(buffer, byteOffset))
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
}`,
    )(ArrayRecordBase)

    for (let i = 0; i < length; ++i) {
        const propertyName = String(i)
        const bitOffset = i * accessor.bits
        Object.defineProperty(ArrayRecord.prototype, propertyName, {
            get: accessor.defineGet(propertyName, bitOffset),
            set: accessor.defineSet(propertyName, bitOffset),
            configurable: true,
            enumerable: true,
        })
    }

    return ArrayRecord
}

export function defineArrayRecord<T extends DataType>(
    elementType: T,
    length: number,
): ArrayRecordConstructor<PropertyTypeOf<T>> {
    assert.integer(length, "length")
    assert.gte(length, 0, "length")

    const accessor = getAccessor(elementType)
    const key = `${length === 0 ? "" : accessor.name}$${length}`
    let retv:
        | ArrayRecordConstructor<PropertyTypeOf<T>>
        | undefined = instances.get(key)

    if (retv == null) {
        retv = defineArrayRecord0(accessor, length)
        instances.set(key, retv)
    }

    return retv
}
