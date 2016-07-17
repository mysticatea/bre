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
 * A text encoder which uses iconv-lite package.
 * This encoder depends on Nodejs's Buffer, so does not fit to browsers.
 * The iconv package can handle legacy Japanese encodings -- Shift_JIS, EUC-JP.
 */
class IConvTextEncoder {
    /**
     * Checks whether a given text is an existing encoding type or not.
     *
     * @param {any} encoding - A value to check.
     * @returns {boolean} `true` if the encoding exists.
     */
    encodingExists(encoding) {
        return typeof encoding === "string" && iconv.encodingExists(encoding)
    }

    /**
     * Encodes a given text by a given encoding.
     *
     * @param {string} text - A text to encode.
     * @param {string} encoding - An encoding type.
     * @returns {DataView} Encoded binary data.
     */
    encode(text, encoding) {
        const data = iconv.encode(text, encoding)
        return new DataView(data.buffer, data.byteOffset, data.byteLength)
    }

    /**
     * Decodes a given data by a given encoding.
     *
     * @param {DataView} data - A data to decode.
     * @param {number} byteOffset - The start index of text data in the data.
     * @param {number} byteLength - The length of text data in the data.
     * @param {string} encoding - An encoding type.
     * @returns {string} Decoded text data.
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
