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

class Accessor {
    constructor(name, bits, options) {
        assert.string(name, "name")
        assert.integer(bits, "bits")
        assert.gte(bits, 1, "bits")

        this.name = name
        this.bits = bits
        this.hasInitCode = (options && options.hasInitCode) === true
        this.readOnly = (options && options.readOnly) === true
    }

    //istanbul ignore next
    initCode(_name, _bitOffset) {
        throw new Error("Not Implemented")
    }

    //istanbul ignore next
    propertyCode(_name, _bitOffset) {
        throw new Error("Not Implemented")
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.Accessor = Accessor
