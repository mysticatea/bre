import { decode, encode, encodingExists } from "iconv-lite"
import { TextEncoder } from "./text-encoder"

class IconvLiteTextEncoder implements TextEncoder {
    encodingExists(value: string): boolean {
        return typeof value === "string" && encodingExists(value)
    }

    encode(text: string, encoding: string): DataView {
        const data = encode(text, encoding)
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
        return decode(buffer, encoding)
    }
}

export default new IconvLiteTextEncoder() as TextEncoder
