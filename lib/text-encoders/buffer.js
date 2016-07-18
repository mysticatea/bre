/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const util = require("./util")
const Buffer = require("buffer").Buffer

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * The text encoder which uses only Nodejs's Buffer.
 *
 * The list of supported encodings is [here].
 *
 * It needs to set a text encoder before you define string fields of records.
 *
 *     const bre = require("bre")
 *     bre.setTextEncoder(require("bre/lib/text-encoders/buffer"))
 *
 *     const ExampleRecord = bre.defineObjectRecord("ExampleRecord", [
 *         {type: "string(15)", name: "s"},
 *         {type: "utf8(32)", name: "utf8"},
 *     ])
 *
 * **Note:** This encoder depends on Node.js [Buffer], so does not fit to
 * browsers.
 *
 * [Buffer]: https://nodejs.org/api/buffer.html#buffer_buffer
 * [here]: https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
 *
 * @memberof module:bre/lib/text-encoders
 */
class NodejsBufferTextEncoder {
    /**
     * Checks whether the given string is a valid encoding type or not.
     * @param {any} value - The value to check.
     * @returns {boolean} `true` if the value is a valid encoding type.
     */
    encodingExists(value) {
        return typeof value === "string" && Buffer.isEncoding(value)
    }

    /**
     * Converts the given string to the binary data of the string.
     * @param {string} text - The text to encode.
     * @param {string} encoding - The encoding type to encode.
     * @returns {DataView} Encoded binary data.
     */
    encode(text, encoding) {
        //eslint-disable-next-line node/no-deprecated-api
        const data = new Buffer(text, encoding)
        return new DataView(data.buffer, data.byteOffset, data.byteLength)
    }

    /**
     * Converts the given binary data to the string of the binary data.
     * @param {DataView} data - the binary data to decode.
     * @param {number} byteOffset - The start index of text data in the data.
     * @param {number} byteLength - The length of text data in the data.
     * @param {string} encoding - The encoding type.
     * @returns {string} Decoded string data.
     */
    decode(data, byteOffset, byteLength, encoding) {
        const buffer = util.createBuffer(
            data.buffer,
            data.byteOffset + byteOffset,
            byteLength
        )
        return buffer.toString(encoding)
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = new NodejsBufferTextEncoder()
