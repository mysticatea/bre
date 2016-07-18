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

/**
 * The field accessor for floatN fields.
 *
 * @private
 */
class FloatAccessor extends Accessor {
    /**
     * @param {number} bits - The number of bits.
     */
    constructor(bits) {
        assert(bits === 32 || bits === 64)
        super(`float${bits}`, bits)
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

        return `get ${name}() {
        return this[s.buffer].getFloat${bits}(${byteOffset})
    }
    set ${name}(value) {
        assert.number(value, ${JSON.stringify(name)})
        this[s.buffer].setFloat${bits}(${byteOffset}, value)
    }`
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.float32 = Object.freeze(new FloatAccessor(32))
exports.float64 = Object.freeze(new FloatAccessor(64))

// aliases.
exports.float = exports.float32
exports.double = exports.float64
