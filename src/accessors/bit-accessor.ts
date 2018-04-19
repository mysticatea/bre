import assert from "../assert"
import { Accessor } from "./accessor"

export class BitAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number
    readonly subRecord: never

    constructor(bits: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
        this.name = `bit${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    propertyCode(propertyName: number | string, bitOffset: number): string {
        assert.numberOrString(propertyName, "propertyName")
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")

        const bits = this.bits as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
        const byteOffset = bitOffset >> 3
        const n0 = bitOffset & 0x07
        const n1 = n0 + bits
        const min = 0
        const max = (1 << bits) - 1
        const accessorBits = n1 <= 8 ? 8 : 16
        const rightBits = accessorBits - n1
        const mask = ((1 << bits) - 1) << rightBits

        return `get ${propertyName}() {
    const data = this[sBuffer].getUint${accessorBits}(${byteOffset})
    return (data & ${mask}) >> ${rightBits}
}
set ${propertyName}(value) {
    assert.integer(value, ${JSON.stringify(propertyName)})
    assert.range(value, ${min}, ${max}, ${JSON.stringify(propertyName)})

    const data = this[sBuffer].getUint${accessorBits}(${byteOffset})
    this[sBuffer].setUint${accessorBits}(
        ${byteOffset},
        ((value << ${rightBits}) & ${mask}) | (data & ~${mask})
    )
}`
    }
}
