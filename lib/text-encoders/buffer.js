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
 * A text encoder which uses only Nodejs's Buffer.
 * This encoder depends on Nodejs's Buffer, so does not fit to browsers.
 */
class NodejsBufferTextEncoder {
    /**
     * Checks whether a given text is an existing encoding type or not.
     *
     * @param {any} encoding - A value to check.
     * @returns {boolean} `true` if the encoding exists.
     */
    encodingExists(encoding) {
        return typeof encoding === "string" && Buffer.isEncoding(encoding)
    }

    /**
     * Encodes a given text by a given encoding.
     *
     * @param {string} text - A text to encode.
     * @param {string} encoding - An encoding type.
     * @returns {DataView} Encoded binary data.
     */
    encode(text, encoding) {
        //eslint-disable-next-line node/no-deprecated-api
        const data = new Buffer(text, encoding)
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
        return buffer.toString(encoding)
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

module.exports = new NodejsBufferTextEncoder()
