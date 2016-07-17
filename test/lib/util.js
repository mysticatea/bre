/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * Gets the message of the thrown exception from a given function.
 *
 * @param {function} f - A function to get.
 * @returns {string|undefined} The message of the thrown exception, or undefined.
 */
exports.thrownMessage = function thrownMessage(f) {
    try {
        f()
        return undefined
    }
    catch (err) {
        return err.message
    }
}
