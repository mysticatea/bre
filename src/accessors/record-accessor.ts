import assert from "../assert"
import {
    ArrayRecordConstructor,
    ObjectRecordConstructor,
    ConstructorOf,
    RecordOf,
} from "../types"
import { Accessor } from "./accessor"

export class RecordAccessor<
    T extends ArrayRecordConstructor | ObjectRecordConstructor
> implements Accessor<RecordOf<T>> {
    readonly name: string
    readonly bits: number
    readonly subRecord: ConstructorOf<RecordOf<T>>

    constructor(Record: T) {
        this.name = Record.name
        this.bits = Record.bitLength
        this.subRecord = Record as any
        Object.freeze(this)
    }

    propertyCode(propertyName: number | string, bitOffset: number) {
        assert.numberOrString(propertyName, "propertyName")
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")
        assert.bitOffsetX8(bitOffset, this.name)

        const { uid, name, byteLength } = this.subRecord
        const byteOffset = bitOffset >> 3

        return `get ${propertyName}() {
    return ${uid}.view(this[sBuffer], ${byteOffset})
}
set ${propertyName}(value) {
    const src = value && value[sBuffer]
    const dst = this[sBuffer]
    assert(src instanceof DataView, "${propertyName} should be a Record instance.")
    assert(value.constructor.uid === ${JSON.stringify(
        uid,
    )}, "${propertyName} should be a ${JSON.stringify(name).slice(
            1,
            -1,
        )} instance.")

    for (let i = 0; i < ${byteLength}; ++i) {
        dst.setUint8(i, src.getUint8(i))
    }
}`
    }
}
