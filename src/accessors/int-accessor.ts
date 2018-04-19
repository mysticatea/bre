import assert from "../assert"
import { Accessor } from "./accessor"

const MIN = { 8: -0x80, 16: -0x8000, 32: -0x80000000 }
const MAX = { 8: 0x7f, 16: 0x7fff, 32: 0x7fffffff }

export class IntAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number
    readonly subRecord: never

    constructor(bits: 8 | 16 | 32) {
        this.name = `int${bits}`
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
        const type = `Int${bits}`
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
