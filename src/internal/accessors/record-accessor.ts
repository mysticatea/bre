import {
    ArrayRecordConstructor,
    ObjectRecordConstructor,
    RecordOf,
} from "../../types"
import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class RecordAccessor<
    T extends ArrayRecordConstructor<any> | ObjectRecordConstructor<any>
> implements Accessor<RecordOf<T>> {
    readonly name: string
    readonly bits: number

    private readonly SubRecord: T

    constructor(SubRecord: T) {
        this.name = SubRecord.name
        this.bits = SubRecord.bitLength
        this.SubRecord = SubRecord
        Object.freeze(this)
    }

    defineGet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record) => RecordOf<T> {
        assert.bitOffsetX8(bitOffset, this.name)

        const SubRecord = this.SubRecord
        const byteOffset = bitOffset >> 3

        return function(this: Record): RecordOf<T> {
            return SubRecord.view(this[sBuffer], byteOffset)
        }
    }

    defineSet(propertyName: string, bitOffset: number): undefined {
        return undefined
    }
}
