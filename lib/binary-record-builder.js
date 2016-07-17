/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const accessors = require("./accessors")
const assert = require("./assert")
const BinaryRecord = require("./binary-record").BinaryRecord
const getArrayRecord = require("./array-record").getArrayRecord
const getObjectRecord = require("./object-record").getObjectRecord

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const NUMBER_ACCESSOR_TYPE = /^(?:u?int(?:8|16|32)|bit[1-7]|float(?:32|64)?|double)$/
const STRING_TYPE = /^([a-zA-Z0-9_-]+)\(([1-9][0-9]*)\)$/
const ARRAY_BRACKET = /^([a-zA-Z0-9_-]+(?:\[[1-9][0-9]*\])*)\[([1-9][0-9]*)\]$/

function parseArrayBrackets(type) {
    if (!(typeof type === "string")) {
        return type
    }

    const m = ARRAY_BRACKET.exec(type)
    if (m == null) {
        return type
    }

    const length = parseInt(m[2], 10)
    const elementType = parseArrayBrackets(m[1])
    if (Array.isArray(elementType)) {
        elementType.push(length)
        return elementType
    }

    return [elementType, length]
}

function getAccessor(type) {
    let m = null

    // Parse array bracket notations.
    // e.g. "int8[4]" → ["int8", 4]
    //      "int32[3][4]" → ["int32", 3, 4]
    //      "string(16)[4]" → ["string(16)", 4]
    const strippedType = parseArrayBrackets(type)

    // Address arrays.
    if (Array.isArray(strippedType)) {
        let accessor = getAccessor(strippedType[0])
        for (let i = strippedType.length - 1; i >= 1; --i) {
            const length = strippedType[i]

            accessor = accessors.record(getArrayRecord(accessor, length))
        }

        return accessor
    }

    // Embedded types and array shorthands.
    if (typeof strippedType === "string") {
        // Number types.
        if (NUMBER_ACCESSOR_TYPE.test(strippedType)) {
            return accessors[strippedType]
        }

        // String types.
        if ((m = STRING_TYPE.exec(strippedType)) != null) {
            const byteLength = parseInt(m[2], 10)
            const encoding = (m[1] === "string") ? "utf8" : m[1]

            return accessors.string(encoding, byteLength)
        }
    }

    // Record types.
    if (typeof strippedType === "function" &&
        strippedType.prototype instanceof BinaryRecord
    ) {
        return accessors.record(strippedType)
    }

    throw new Error(`invalid type: ${strippedType}`)
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.defineObjectRecord = function defineObjectRecord(className, fields) {
    assert.instanceOf(fields, Array, "fields")

    const definition = fields.reduce(
        (d, f, i) => {
            if ("skip" in f) {
                assert.integer(f.skip, `fields[${i}].skip`)
                assert.gte(f.skip, 1, `fields[${i}].skip`)

                d.bitLength += f.skip
            }
            else {
                const name = f.name
                const accessor = getAccessor(f.type)
                const offset = d.bitLength

                d.fields.push({name, accessor, offset})
                d.bitLength += accessor.bits
            }

            return d
        },
        {className, fields: [], bitLength: 0}
    )

    return getObjectRecord(definition)
}

exports.defineArrayRecord = function defineArrayRecord(type, length) {
    return getArrayRecord(getAccessor(type), length)
}
