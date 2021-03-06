import assert from "./assert"
import { sBuffer } from "./types"

export class Record {
    private readonly [sBuffer]: DataView

    constructor(
        buffer: ArrayBuffer | ArrayBufferView,
        byteOffset: number,
        byteLength: number,
    ) {
        const rawBuffer = ArrayBuffer.isView(buffer) ? buffer.buffer : buffer
        const rawByteOffset = ArrayBuffer.isView(buffer) ? buffer.byteOffset : 0

        assert.instanceOf(rawBuffer, ArrayBuffer, "buffer")
        assert.integer(byteOffset, "byteOffset")
        assert.gte(byteOffset, 0, "byteOffset")
        assert.integer(byteLength, "byteLength")
        assert.gte(byteLength, 0, "byteLength")
        assert(
            buffer.byteLength >= byteOffset + byteLength,
            `'buffer' should have enough size for the offset and size of this record (${byteOffset} + ${byteLength} = ${byteOffset +
                byteLength}), but got ${buffer.byteLength}.`,
        )

        this[sBuffer] = new DataView(
            rawBuffer,
            rawByteOffset + byteOffset,
            byteLength,
        )
    }

    get [Symbol.toStringTag]() {
        return "Record"
    }

    toString() {
        const data = this[sBuffer]
        const length = data.byteLength
        let s = `[object ${this[Symbol.toStringTag]} `

        for (let i = 0; i < length; ++i) {
            const elementValue = data.getUint8(i)
            if (elementValue < 0x10) {
                s += "0"
            }
            s += elementValue.toString(16)
        }
        s += "]"

        return s
    }
}
