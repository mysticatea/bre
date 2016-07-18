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
const iconv = util.require("iconv-lite", "bre/lib/text-encoders/iconv")

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * The text encoder which uses [iconv-lite] package.
 *
 * The iconv package supports legacy Japanese encodings -- Shift_JIS, EUC-JP.<br>
 * The list of supported encodings is [here].
 *
 *     const bre = require("bre")
 *     bre.setTextEncoder(require("bre/lib/text-encoders/iconv"))
 *
 *     const ExampleRecord = bre.defineObjectRecord("ExampleRecord", [
 *         {type: "string(15)", name: "s"},
 *         {type: "utf8(32)", name: "utf8"},
 *         {type: "shift_jis(32)", name: "sjis"},
 *     ])
 *
 * **Note:** This encoder depends on Node.js [Buffer], so does not fit to
 * browsers.<br>
 * **Note:** You requires to install [iconv-lite] before a use of this.
 *
 *     $ npm install --save iconv-lite
 *
 * [Buffer]: https://nodejs.org/api/buffer.html#buffer_buffer
 * [iconv-lite]: https://www.npmjs.com/package/iconv-lite
 * [here]: https://www.npmjs.com/package/iconv-lite#supported-encodings
 *
 * @memberof module:bre/lib/text-encoders
 */
class IConvTextEncoder {
    /**
     * Checks whether the given string is a valid encoding type or not.
     * @param {any} value - The value to check.
     * @returns {boolean} `true` if the value is a valid encoding type.
     */
    encodingExists(value) {
        return typeof value === "string" && iconv.encodingExists(value)
    }

    /**
     * Converts the given string to the binary data of the string.
     * @param {string} text - The text to encode.
     * @param {string} encoding - The encoding type to encode.
     * @returns {DataView} Encoded binary data.
     */
    encode(text, encoding) {
        const data = iconv.encode(text, encoding)
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
        return iconv.decode(buffer, encoding)
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = new IConvTextEncoder()
