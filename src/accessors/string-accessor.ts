import assert from "../assert"
import { Accessor } from "./accessor"

export class StringAccessor implements Accessor<string> {
    readonly name: string
    readonly bits: number
    readonly subRecord: never

    private readonly encoding: string
    private readonly byteLength: number

    constructor(encoding: string, byteLength: number) {
        this.name = `string$${encoding}$${byteLength}`
        this.bits = byteLength << 3
        this.encoding = encoding
        this.byteLength = byteLength
        Object.freeze(this)
    }

    propertyCode(propertyName: number | string, bitOffset: number): string {
        assert.numberOrString(propertyName, "propertyName")
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const byteLength = this.byteLength
        const encoding = this.encoding

        return `get ${propertyName}() {
    const b = this[sBuffer]
    let i = 0
    for (; i < ${byteLength} && b.getUint8(${byteOffset} + i) !== 0; ++i)
        ;
    return TextEncoder.decode(b, ${byteOffset}, i, ${JSON.stringify(encoding)})
}
set ${propertyName}(value) {
    assert.string(value, ${JSON.stringify(propertyName)})

    const buffer = this[sBuffer]
    const encoded = TextEncoder.encode(value, ${JSON.stringify(encoding)})
    assert.lte(
        encoded.byteLength,
        ${byteLength},
        "byteLength of " + ${JSON.stringify(propertyName)}
    )

    let i = 0
    for (; i < encoded.byteLength; ++i) {
        buffer.setUint8(${byteOffset} + i, encoded.getUint8(i))
    }
    for (; i < ${byteLength}; ++i) {
        buffer.setUint8(${byteOffset} + i, 0x00)
    }
}`
    }
}
