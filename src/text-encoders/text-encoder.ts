export interface TextEncoder {
    encodingExists(value: string): boolean
    encode(text: string, encoding: string): DataView
    decode(
        data: DataView,
        byteOffset: number,
        byteLength: number,
        encoding: string,
    ): string
}
