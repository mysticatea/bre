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

/**
 * Gets the current text encoder.
 *
 * Default is `null`.
 *
 *     const encoder = bre.getTextEncoder()
 *     console.log(encoder)
 *
 * @method module:bre.getTextEncoder
 * @returns {module:bre/lib/text-encoders.TextEncoder|null} The current text encoder.
 */
exports.getTextEncoder = function getTextEncoder() {
    return currentEncoder
}

/**
 * Sets the current text encoder.
 *
 * If you want to use `string` fields in records, you needs to set a text
 * encoder.
 *
 *     const encoder = require("bre/lib/text-encoders/buffer")
 *     bre.setTextEncoder(encoder)
 *
 * `bre` provides 2 implementations of TextEncoder.
 *
 * - {@link module:bre/lib/text-encoders.NodejsBufferTextEncoder}
 * - {@link module:bre/lib/text-encoders.IConvTextEncoder}
 *
 * @method module:bre.setTextEncoder
 * @param {module:bre/lib/text-encoders.TextEncoder|null} value - The text encoder to set.
 * @returns {void}
 */
exports.setTextEncoder = function setTextEncoder(value) {
    if (value !== null) {
        assert.object(value, "value")
        assert.function(value.encodingExists, "value.encodingExists")
        assert.function(value.encode, "value.encode")
        assert.function(value.decode, "value.decode")
    }

    currentEncoder = value
}

/**
 * @module bre/lib/text-encoders
 */

/**
 * TextEncoder is the interface to encode/decode strings.
 *
 * TextEncoder is used to define string fields of records.
 *
 * `bre` provides 2 implementations of `TextEncoder`.
 *
 * - {@link module:bre/lib/text-encoders.NodejsBufferTextEncoder}
 * - {@link module:bre/lib/text-encoders.IConvTextEncoder}
 *
 * @memberof module:bre/lib/text-encoders
 * @interface TextEncoder
 */

/**
 * Checks whether the given string is a valid encoding type or not.
 * @method module:bre/lib/text-encoders.TextEncoder#encodingExists
 * @param {any} value - The value to check.
 * @returns {boolean} `true` if the value is a valid encoding type.
 */

/**
 * Converts the given string to the binary data of the string.
 * @method module:bre/lib/text-encoders.TextEncoder#encode
 * @param {string} text - The text to encode.
 * @param {string} encoding - The encoding type to encode.
 * @returns {DataView} Encoded binary data.
 */

/**
 * Converts the given binary data to the string of the binary data.
 * @method module:bre/lib/text-encoders.TextEncoder#decode
 * @param {DataView} data - the binary data to decode.
 * @param {number} byteOffset - The start index of text data in the data.
 * @param {number} byteLength - The length of text data in the data.
 * @param {string} encoding - The encoding type.
 * @returns {string} Decoded string data.
 */
