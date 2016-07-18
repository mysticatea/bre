/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("../assert")
const getTextEncoder = require("../text-encoder-registry").getTextEncoder
const Accessor = require("./accessor").Accessor

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const instances = new Map()

/**
 * The field accessor for stringN fields.
 *
 * @private
 */
class StringAccessor extends Accessor {
    /**
     * @param {string} encoding - The encoding of strings to access.
     * @param {byteLength} byteLength - The maximum length of strings.
     */
    constructor(encoding, byteLength) {
        const encoder = getTextEncoder()
        assert(
            encoder != null,
            "'bre.setTextEncoder()' is required before a use of string type."
        )
        assert.string(encoding, "encoding")
        assert(
            encoder.encodingExists(encoding),
            "'encoding' should be a valid encoding type, " +
            `but got ${JSON.stringify(encoding)}.`
        )
        assert.integer(byteLength, "byteLength")
        assert.gte(byteLength, 1, "byteLength")
        super(`string$${encoding}$${byteLength}`, byteLength << 3)

        this.encoding = JSON.stringify(encoding)
        this.byteLength = byteLength
    }

    /**
     * Gets the getter/setter pair logic for this accessor.
     *
     * @param {string} name - The property name to access.
     * @param {string} bitOffset - The data position to access.
     * @returns {string} The getter/setter code of the property.
     */
    propertyCode(name, bitOffset) {
        assert.numberOrString(name, "name")
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3
        const byteLength = this.byteLength
        const encoding = this.encoding

        return `get ${name}() {
        const b = this[s.buffer]
        let i = 0
        for (; i < ${byteLength} && b.getUint8(${byteOffset} + i) !== 0; ++i)
            ;
        return TextEncoder.decode(b, ${byteOffset}, i,${encoding})
    }
    set ${name}(value) {
        assert.string(value, ${JSON.stringify(name)})

        const buffer = this[s.buffer]
        const encoded = TextEncoder.encode(value, ${encoding})
        assert.lte(
            encoded.byteLength,
            ${byteLength},
            "byteLength of " + ${JSON.stringify(name)}
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

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.string = (encoding, byteLength) => {
    const key = `string$${encoding}$${byteLength}`

    let accessor = instances.get(key)
    if (accessor == null) {
        accessor = new StringAccessor(encoding, byteLength)
        instances.set(key, accessor)
    }

    return accessor
}
