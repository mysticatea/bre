/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert")
const BinaryRecord = require("./binary-record")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const AIUEO = /^[aiueo]/i
const STARTS_WITH_FUNCTION = /^function /

function articleOf(type) {
    if (type === "null" || type === "undefined") {
        return ""
    }
    if (STARTS_WITH_FUNCTION.test(type)) {
        return ""
    }
    return AIUEO.test(type) ? "an " : "a "
}

function typeNameOf(value) {
    if (value === null) {
        return "null"
    }
    if (Number.isInteger(value)) {
        return "integer"
    }

    const type = typeof value
    if (type === "object" &&
        value.constructor &&
        value.constructor.name &&
        value.constructor.name !== "Object"
    ) {
        return `${value.constructor.name} object`
    }
    if (type === "function") {
        if (value.name) {
            return `function ${JSON.stringify(value.name)}`
        }
        return "anonymous function"
    }

    return type
}

function typeOf(value) {
    const type = typeNameOf(value)
    return `${articleOf(type)}${type}`
}

//------------------------------------------------------------------------------
// Export
//------------------------------------------------------------------------------

module.exports = Object.assign(
    (test, message) => {
        assert(test, message)
    },
    assert,
    {
        boolean(value, name) {
            assert(typeof value === "boolean", `'${name}' should be a boolean, but got ${typeOf(value)}.`)
        },

        number(value, name) {
            assert(typeof value === "number", `'${name}' should be a number, but got ${typeOf(value)}.`)
        },

        string(value, name) {
            assert(typeof value === "string", `'${name}' should be a string, but got ${typeOf(value)}.`)
        },

        object(value, name) {
            assert(typeof value === "object" && value != null, `'${name}' should be an object, but got ${typeOf(value)}.`)
        },

        function(value, name) {
            assert(typeof value === "function", `'${name}' should be a function, but got ${typeOf(value)}.`)
        },

        numberOrString(value, name) {
            const type = typeof value
            assert(type === "number" || type === "string", `'${name}' should be a number or a string, but got ${typeOf(value)}.`)
        },

        instanceOf(value, type, name) {
            assert(value instanceof type, `'${name}' should be ${articleOf(type.name)}${type.name} object, but got ${typeOf(value)}.`)
        },

        integer(value, name) {
            assert(Number.isInteger(value), `'${name}' should be an integer, but got ${typeOf(value)}.`)
        },

        gte(value, min, name) {
            assert(value >= min, `'${name}' should be '>=${min}', but got ${value}.`)
        },

        lte(value, max, name) {
            assert(value <= max, `'${name}' should be '<=${max}', but got ${value}.`)
        },

        range(value, min, max, name) {
            assert(value >= min && value <= max, `'${name}' should be within '${min}..${max}', but got ${value}.`)
        },

        bitOffsetX8(value, accessorTypeName) {
            this.integer(value, "bitOffset")
            assert((value & 0x07) === 0, `'bitOffset' should be a multiple of 8 for '${accessorTypeName}', but got ${value}.`)
        },
    }
)
