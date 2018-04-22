import assert from "./internal/assert"
import { TextEncoder } from "./types"

let currentTextEncoder: TextEncoder | null = null

export function getTextEncoder(): TextEncoder | null {
    return currentTextEncoder
}

export function setTextEncoder(value: TextEncoder | null): void {
    if (value) {
        assert.function(value.decode, "value.decode")
        assert.function(value.encode, "value.encode")
        assert.function(value.encodingExists, "value.encodingExists")
    }
    currentTextEncoder = value
}
