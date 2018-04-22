import { getTextEncoder } from "../text-encoder-registry"
import {
    ArrayRecordConstructor,
    DataType,
    ObjectRecordConstructor,
    PropertyTypeOf,
    StringDataType,
} from "../types"
import assert from "./assert"
import { Accessor } from "./types"
import { BitAccessor } from "./accessors/bit-accessor"
import { FloatAccessor } from "./accessors/float-accessor"
import { IntAccessor } from "./accessors/int-accessor"
import { RecordAccessor } from "./accessors/record-accessor"
import { StringAccessor } from "./accessors/string-accessor"
import { UintAccessor } from "./accessors/uint-accessor"

const numericAccessors = Object.freeze({
    bit1: new BitAccessor(1),
    bit2: new BitAccessor(2),
    bit3: new BitAccessor(3),
    bit4: new BitAccessor(4),
    bit5: new BitAccessor(5),
    bit6: new BitAccessor(6),
    bit7: new BitAccessor(7),
    int8: new IntAccessor(8),
    int16: new IntAccessor(16),
    int32: new IntAccessor(32),
    uint8: new UintAccessor(8),
    uint16: new UintAccessor(16),
    uint32: new UintAccessor(32),
    float32: new FloatAccessor(32),
    float64: new FloatAccessor(64),
})
const stringPool = new Map<string, StringAccessor>()
const recordPool = new Map<
    ArrayRecordConstructor | ObjectRecordConstructor,
    RecordAccessor<any>
>()

function isNumericDataType(type: any): type is keyof typeof numericAccessors {
    return (
        typeof type === "string" &&
        Object.prototype.hasOwnProperty.call(numericAccessors, type)
    )
}

function isStringDataType(type: any): type is StringDataType {
    return (
        typeof type === "object" &&
        typeof type.encoding === "string" &&
        typeof type.byteLength === "number"
    )
}

function getStringAccessor(
    encoding: string,
    byteLength: number,
): StringAccessor {
    const key = `string$${encoding}$${byteLength}`

    let accessor = stringPool.get(key)
    if (accessor == null) {
        const encoder = getTextEncoder()
        assert(
            encoder != null,
            "Requires 'bre.setTextEncoder()' prior to use of string type.",
        )
        assert.string(encoding, "encoding")
        assert(
            encoder!.encodingExists(encoding),
            `'encoding' should be a valid encoding type, but got '${encoding}'.`,
        )
        assert.integer(byteLength, "byteLength")
        assert.gte(byteLength, 1, "byteLength")

        accessor = new StringAccessor(encoder!, encoding, byteLength)
        stringPool.set(key, accessor)
    }

    return accessor
}

function getRecordAccessor<
    T extends ArrayRecordConstructor | ObjectRecordConstructor
>(Record: T): RecordAccessor<T> {
    let accessor: RecordAccessor<T> | undefined = recordPool.get(Record)

    if (accessor == null) {
        accessor = new RecordAccessor(Record)
        recordPool.set(Record, accessor)
    }

    return accessor
}

export function getAccessor<T extends DataType>(
    type: T,
): Accessor<PropertyTypeOf<T>> {
    if (isNumericDataType(type)) {
        return numericAccessors[type]
    }
    if (isStringDataType(type)) {
        return getStringAccessor(type.encoding, type.byteLength) as any // WHY?
    }

    // https://github.com/Microsoft/TypeScript/issues/13995
    return getRecordAccessor(type as any)
}
