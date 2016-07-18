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
 * The field accessor for bitN fields.
 *
 * @private
 */
class BitAccessor extends Accessor {
    /**
     * @param {number} bits - The number of bits.
     */
    constructor(bits) {
        assert.integer(bits, "bits")
        assert.range(bits, 1, 7, "bits")
        super(`bit${bits}`, bits)
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
        assert.integer(bitOffset, "bitOffset")
        assert.gte(bitOffset, 0, "bitOffset")

        const bits = this.bits
        const byteOffset = bitOffset >> 3
        const n0 = bitOffset & 0x07
        const n1 = n0 + bits
        const min = 0
        const max = (1 << bits) - 1
        const accessorBits = (n1 <= 8 ? 8 : 16)
        const rightBits = accessorBits - n1
        const mask = ((1 << bits) - 1) << rightBits

        return `get ${name}() {
        const data = this[s.buffer].getUint${accessorBits}(${byteOffset})
        return (data & ${mask}) >> ${rightBits}
    }
    set ${name}(value) {
        assert.integer(value, ${JSON.stringify(name)})
        assert.range(value, ${min}, ${max}, ${JSON.stringify(name)})

        const data = this[s.buffer].getUint${accessorBits}(${byteOffset})
        this[s.buffer].setUint${accessorBits}(
            ${byteOffset},
            ((value << ${rightBits}) & ${mask}) | (data & ~${mask})
        )
    }`
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.bit1 = new BitAccessor(1)
exports.bit2 = new BitAccessor(2)
exports.bit3 = new BitAccessor(3)
exports.bit4 = new BitAccessor(4)
exports.bit5 = new BitAccessor(5)
exports.bit6 = new BitAccessor(6)
exports.bit7 = new BitAccessor(7)
