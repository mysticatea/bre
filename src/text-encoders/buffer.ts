import { TextEncoder } from "./text-encoder"

class NodejsBufferTextEncoder implements TextEncoder {
    encodingExists(value: string): boolean {
        return typeof value === "string" && Buffer.isEncoding(value)
    }

    encode(text: string, encoding: string): DataView {
        const data = Buffer.from(text, encoding)
        return new DataView(data.buffer, data.byteOffset, data.byteLength)
    }

    decode(
        data: DataView,
        byteOffset: number,
        byteLength: number,
        encoding: string,
    ): string {
        const buffer = Buffer.from(
            data.buffer,
            data.byteOffset + byteOffset,
            byteLength,
        )
        return buffer.toString(encoding)
    }
}

export default new NodejsBufferTextEncoder() as TextEncoder
