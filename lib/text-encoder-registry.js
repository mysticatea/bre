/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("./assert")

//------------------------------------------------------------------------------
// Helper
//------------------------------------------------------------------------------

let currentEncoder = null

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.getTextEncoder = function getTextEncoder() {
    return currentEncoder
}

exports.setTextEncoder = function setTextEncoder(value) {
    if (value != null) {
        assert.object(value, "value")
        assert.function(value.encodingExists, "value.encodingExists")
        assert.function(value.encode, "value.encode")
        assert.function(value.decode, "value.decode")
    }

    currentEncoder = value
}
