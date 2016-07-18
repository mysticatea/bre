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
const Accessor = require("./accessor").Accessor

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const INT_MIN = {8: -0x80, 16: -0x8000, 32: -0x80000000}
const INT_MAX = {8: 0x7F, 16: 0x7FFF, 32: 0x7FFFFFFF}
const UINT_MAX = {8: 0xFF, 16: 0xFFFF, 32: 0xFFFFFFFF}

/**
 * The field accessor for intN/uintN fields.
 *
 * @private
 */
class IntAccessor extends Accessor {
    /**
     * @param {number} bits - The number of bits.
     * @param {boolean} unsigned - The flag to indicate whether the data to access is unsigned or not.
     */
    constructor(bits, unsigned) {
        assert(bits === 8 || bits === 16 || bits === 32)
        assert.boolean(unsigned, "unsigned")
        super(`${unsigned ? "u" : ""}int${bits}`, bits)

        this.unsigned = unsigned
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
        const bits = this.bits
        const unsigned = this.unsigned
        const prefix = unsigned ? "Uint" : "Int"
        const type = `${prefix}${bits}`
        const min = unsigned ? 0 : INT_MIN[bits]
        const max = unsigned ? UINT_MAX[bits] : INT_MAX[bits]

        return `get ${name}() {
        return this[s.buffer].get${type}(${byteOffset})
    }
    set ${name}(value) {
        assert.integer(value, ${JSON.stringify(name)})
        assert.range(value, ${min}, ${max}, ${JSON.stringify(name)})
        this[s.buffer].set${type}(${byteOffset}, value)
    }`
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.int8 = Object.freeze(new IntAccessor(8, false))
exports.int16 = Object.freeze(new IntAccessor(16, false))
exports.int32 = Object.freeze(new IntAccessor(32, false))
exports.uint8 = Object.freeze(new IntAccessor(8, true))
exports.uint16 = Object.freeze(new IntAccessor(16, true))
exports.uint32 = Object.freeze(new IntAccessor(32, true))
