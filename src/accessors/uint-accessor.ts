import assert from "../assert"
import { Accessor } from "./accessor"

const MIN = { 8: 0x00, 16: 0x0000, 32: 0x00000000 }
const MAX = { 8: 0xff, 16: 0xffff, 32: 0xffffffff }

export class UintAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number
    readonly subRecord: never

    constructor(bits: 8 | 16 | 32) {
        this.name = `uint${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    propertyCode(propertyName: number | string, bitOffset: number): string {
        assert.numberOrString(propertyName, "propertyName")
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const bits = this.bits as 8 | 16 | 32
        const type = `Uint${bits}`
        const min = MIN[bits]
        const max = MAX[bits]

        return `get ${propertyName}() {
    return this[sBuffer].get${type}(${byteOffset})
}
set ${propertyName}(value) {
    assert.integer(value, ${JSON.stringify(propertyName)})
    assert.range(value, ${min}, ${max}, ${JSON.stringify(propertyName)})
    this[sBuffer].set${type}(${byteOffset}, value)
}`
    }
}
