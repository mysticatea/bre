import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class FloatAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number

    constructor(bits: 32 | 64) {
        this.name = `float${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    defineGet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record) => number {
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const method = `getFloat${this.bits}` as "getFloat32" | "getFloat64"

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
        const method = `setFloat${this.bits}` as "setFloat32" | "setFloat64"

        return function(this: Record, value: number): void {
            assert.number(value, propertyName)
            this[sBuffer][method](byteOffset, value)
        }
    }
}
