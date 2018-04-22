import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class BitAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number

    constructor(bits: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        this.name = `bit${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    defineGet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record) => number {
        const bits = this.bits as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
        const byteOffset = bitOffset >> 3
        const n0 = bitOffset & 0x07
        const n1 = n0 + bits
        const accessorBits = n1 <= 8 ? 8 : 16
        const rightBits = accessorBits - n1
        const mask = ((1 << bits) - 1) << rightBits
        const method = `getUint${accessorBits}` as "getUint8" | "getUint16"

        return function(this: Record): number {
            const data = this[sBuffer][method](byteOffset)
            return (data & mask) >> rightBits
        }
    }

    defineSet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record, value: number) => void {
        const bits = this.bits as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
        const byteOffset = bitOffset >> 3
        const n0 = bitOffset & 0x07
        const n1 = n0 + bits
        const min = 0
        const max = (1 << bits) - 1
        const accessorBits = n1 <= 8 ? 8 : 16
        const rightBits = accessorBits - n1
        const mask = max << rightBits
        const get = `getUint${accessorBits}` as "getUint8" | "getUint16"
        const set = `setUint${accessorBits}` as "setUint8" | "setUint16"

        return function(this: Record, value: number) {
            assert.integer(value, propertyName)
            assert.range(value, min, max, propertyName)
            const buffer = this[sBuffer]
            const data = buffer[get](byteOffset)
            const byteValue = ((value << rightBits) & mask) | (data & ~mask)
            buffer[set](byteOffset, byteValue)
        }
    }
}
