import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class IntAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number

    constructor(bits: 8 | 16 | 32) {
        this.name = `int${bits}`
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
        const method = `getInt${bits}` as "getInt8" | "getInt16" | "getInt32"

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
        const min = -(2 ** (bits - 1))
        const max = 2 ** (bits - 1) - 1
        const method = `setInt${bits}` as "setInt8" | "setInt16" | "setInt32"

        return function(this: Record, value: number): void {
            assert.integer(value, propertyName)
            assert.range(value, min, max, propertyName)
            this[sBuffer][method](byteOffset, value)
        }
    }
}
