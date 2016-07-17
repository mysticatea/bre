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
const Accessor = require("./accessors").Accessor
const BinaryRecord = require("./binary-record").BinaryRecord
const registry = require("./text-encoder-registry")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const VALID_RECORD_NAME = /^[A-Z][a-zA-Z0-9_$]*$/
const VALID_FIELD_NAME = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
const INVALID_FIELD_NAME = /^(?:__(?:(?:define|lookup)(?:G|S)etter|proto|noSuchMethod)__|constructor|hasOwnProperty|isPrototypeOf|propertyIsEnumerable|toJSON|toLocaleString|toString|valueOf)$/

function makeRecordPool(pool, field) {
    const accessor = field.accessor
    if ("Record" in accessor && !(accessor.uid in pool)) {
        pool[accessor.uid] = accessor.Record
    }

    return pool
}

function initCode(fields) {
    if (!fields.some(f => f.accessor.hasInitCode)) {
        return ""
    }

    return `this[s.subRecords] = Object.create(null)
        ${
    fields
        .filter(f => f.accessor.hasInitCode)
        .map(f => f.accessor.initCode(f.name, f.offset))
        .join("\n        ")
}
        Object.freeze(this[s.subRecords])`
}

function propertiesCode(fields) {
    return fields
        .map(f => f.accessor.propertyCode(f.name, f.offset))
        .join("\n    ")
}

function keysCode(fields) {
    return fields
        .map(f => `yield ${JSON.stringify(f.name)}`)
        .join("\n        ")
}

function toJSONCode(fields) {
    return fields
        .map(f => `${f.name}: this.${f.name},`)
        .join("\n            ")
}

function defineObjectRecord(definition) {
    const className = definition.className
    const bitLength = definition.bitLength
    const fields = definition.fields
    const byteLength = (bitLength >> 3) + ((bitLength & 0x07) ? 1 : 0)
    const TextEncoder = registry.getTextEncoder()
    const RecordPool = fields.reduce(makeRecordPool, {})
    return Function("assert", "BinaryRecord", "TextEncoder", "RecordPool", `
"use strict"
const s = BinaryRecord.symbols
class ${className} extends BinaryRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset)
        ${initCode(fields)}
    }

    static view(buffer, byteOffset) {
        return Object.freeze(new ${className}(buffer, byteOffset))
    }

    static bitLength() {
        return ${bitLength}
    }

    static byteLength() {
        return ${byteLength}
    }

    static* keys() {
        ${keysCode(fields)}
    }

    ${propertiesCode(fields)}

    toJSON() {
        return {
            ${toJSONCode(fields)}
        }
    }
}

return ${className}
`)(assert, BinaryRecord, TextEncoder, RecordPool)
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.getObjectRecord = function getObjectRecord(definition) {
    assert.string(definition.className, "className")
    assert(
        VALID_RECORD_NAME.test(definition.className),
        "'className' should be a PascalCase Identifier, " +
        `but got ${JSON.stringify(definition.className)}.`
    )
    assert.integer(definition.bitLength, "bitLength")
    assert.instanceOf(definition.fields, Array, "fields")

    const names = new Set()
    definition.fields.forEach((field, index) => {
        assert.object(field, `fields[${index}]`)
        assert.string(field.name, `fields[${index}].name`)
        assert(
            VALID_FIELD_NAME.test(field.name),
            `'fields[${index}].name' should be a camelCase identifier, ` +
            `but got ${JSON.stringify(field.name)}.`
        )
        assert(
            !INVALID_FIELD_NAME.test(field.name),
            `'fields[${index}].name' should be a valid name, ` +
            `but got an forbidden name ${field.name}.`
        )
        assert(
            !names.has(field.name),
            `'fields[${index}].name' should not be duplicate of other field ` +
            `names, but got duplicate name ${field.name}.`
        )
        assert.instanceOf(field.accessor, Accessor, `fields[${index}].accessor`)
        assert.integer(field.offset, `fields[${index}].offset`)
        assert.gte(field.offset, 0, `fields[${index}].offset`)

        names.add(field.name)
    })

    return defineObjectRecord(definition)
}
