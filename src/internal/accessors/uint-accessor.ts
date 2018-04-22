import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class UintAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number

    constructor(bits: 8 | 16 | 32) {
        this.name = `uint${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    defineGet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record) => number {
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const bits = this.bits
        const method = `getUint${bits}` as
            | "getUint8"
            | "getUint16"
            | "getUint32"

        return function(this: Record): number {
            return this[sBuffer][method](byteOffset)
        }
    }

    defineSet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record, value: number) => void {
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const bits = this.bits
        const max = 2 ** bits - 1
        const method = `setUint${bits}` as
            | "setUint8"
            | "setUint16"
            | "setUint32"

        return function(this: Record, value: number): void {
            assert.integer(value, propertyName)
            assert.range(value, 0, max, propertyName)
            this[sBuffer][method](byteOffset, value)
        }
    }
}
