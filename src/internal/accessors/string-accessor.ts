import { TextEncoder } from "../../types"
import assert from "../assert"
import { Accessor, Record, sBuffer } from "../types"

export class StringAccessor implements Accessor<string> {
    readonly name: string
    readonly bits: number

    private readonly encoder: TextEncoder
    private readonly encoding: string
    private readonly byteLength: number

    constructor(encoder: TextEncoder, encoding: string, byteLength: number) {
        this.name = `string$${encoding}$${byteLength}`
        this.bits = byteLength << 3
        this.encoder = encoder
        this.encoding = encoding
        this.byteLength = byteLength
        Object.freeze(this)
    }

    defineGet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record) => string {
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const byteLength = this.byteLength
        const encoder = this.encoder
        const encoding = this.encoding

        return function(this: Record): string {
            const buffer = this[sBuffer]
            let i = 0
            while (i < byteLength && buffer.getUint8(byteOffset + i) !== 0) {
                i += 1
            }
            return encoder.decode(buffer, byteOffset, i, encoding)
        }
    }

    defineSet(
        propertyName: string,
        bitOffset: number,
    ): (this: Record, value: string) => void {
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const byteLength = this.byteLength
        const encoder = this.encoder
        const encoding = this.encoding

        return function(this: Record, value: string): void {
            assert.string(value, propertyName)

            const buffer = this[sBuffer]
            const encoded = encoder.encode(value, encoding)
            assert.lte(
                encoded.byteLength,
                byteLength,
                `byteLength of ${propertyName}`,
            )

            let i = 0
            for (; i < encoded.byteLength; ++i) {
                buffer.setUint8(byteOffset + i, encoded.getUint8(i))
            }
            for (; i < byteLength; ++i) {
                buffer.setUint8(byteOffset + i, 0x00)
            }
        }
    }
}
