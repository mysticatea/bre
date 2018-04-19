import assert from "../assert"
import { Accessor } from "./accessor"

export class FloatAccessor implements Accessor<number> {
    readonly name: string
    readonly bits: number
    readonly subRecord: never

    constructor(bits: 32 | 64) {
        this.name = `float${bits}`
        this.bits = bits
        Object.freeze(this)
    }

    propertyCode(propertyName: number | string, bitOffset: number): string {
        assert.numberOrString(propertyName, "propertyName")
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const bits = this.bits as 32 | 64

        return `get ${propertyName}() {
    return this[sBuffer].getFloat${bits}(${byteOffset})
}
set ${propertyName}(value) {
    assert.number(value, ${JSON.stringify(propertyName)})
    this[sBuffer].setFloat${bits}(${byteOffset}, value)
}`
    }
}
