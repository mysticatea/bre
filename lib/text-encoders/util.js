/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Buffer = require("buffer").Buffer

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ArrayBufferViewIsSupported = Boolean(
    Buffer.from &&
    // Node 4 does not support 'Buffer.from(arrayBuffer, byteOffset, length)'.
    Buffer.from.length >= 3
)

/**
 * Creates a new Buffer object and copies the range of a given ArrayBuffer
 * object.
 *
 * This function will be used in only Node.js 4 because Node.js 4 does not have
 * the factory method to view the range of an ArrayBuffer object.
 *
 *     Buffer.from(arrayBuffer, byteOffset, length)
 *
 * @param {ArrayBuffer} data - The binary data to copy.
 * @param {number} byteOffset - The start index of the range.
 * @param {number} byteLength - The size of the range.
 * @returns {Buffer} The created buffer.
 * @private
 */
function createBuffer(data, byteOffset, byteLength) {
    //eslint-disable-next-line node/no-deprecated-api
    const dst = new Buffer(byteLength)
    const src = new Uint8Array(data, byteOffset, byteLength)

    // Copy
    let i = 0
    for (; i < byteLength; ++i) {
        dst[i] = src[i]
    }

    return dst
}

/**
 * Import a given module.
 * If the importing failed, this will throw an error with better message.
 *
 * @param {string} moduleName - The module name to import.
 * @param {string} encoderName - The encoder name which requires this module.
 * @returns {object} The imported object.
 * @private
 */
function requireOpt(moduleName, encoderName) {
    try {
        return require(moduleName)
    }
    catch (cause) {
        const err = new Error(
            `Please install an optional dependency "${moduleName}" ` +
            `to use "${encoderName}".\n\n` +
            `    npm install --save ${moduleName}\n\n`
        )
        err.cause = cause

        throw err
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.createBuffer = ArrayBufferViewIsSupported ? Buffer.from : createBuffer
exports.require = requireOpt
