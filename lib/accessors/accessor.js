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

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * The base class for field accessors.
 *
 * @private
 */
class Accessor {
    /**
     * @param {string} name - The name of this accessor.
     * @param {number} bits - The data size in bits to access.
     * @param {object} [options] - The options:
     * @param {boolean} [options.hasInitCode=false] - The flag to indicate
     *  whether this accessor has `initCode` logic or not.
     * @param {boolean} [options.readOnly=false] - The flag to indicate whether
     *  this accessor is read-only or not.
     */
    constructor(name, bits, options) {
        assert.string(name, "name")
        assert.integer(bits, "bits")
        assert.gte(bits, 1, "bits")

        this.name = name
        this.bits = bits
        this.hasInitCode = (options && options.hasInitCode) === true
        this.readOnly = (options && options.readOnly) === true
    }

    /*istanbul ignore next */
    /**
     * Gets the initialize logic for this accessor.
     *
     * @param {string} _name - The property name to initialize.
     * @param {string} _bitOffset - The data position to initialize.
     * @returns {string} The initialize code of the property.
     */
    initCode(_name, _bitOffset) {
        throw new Error("Not Implemented")
    }

    /*istanbul ignore next */
    /**
     * Gets the getter/setter pair logic for this accessor.
     *
     * @param {string} _name - The property name to access.
     * @param {string} _bitOffset - The data position to access.
     * @returns {string} The getter/setter code of the property.
     */
    propertyCode(_name, _bitOffset) {
        throw new Error("Not Implemented")
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.Accessor = Accessor
