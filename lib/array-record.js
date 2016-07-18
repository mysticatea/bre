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
const BinaryRecord = require("./binary-record").BinaryRecord
const registry = require("./text-encoder-registry")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const ARRAY_METHODS = [
    "concat",
    "entries",
    "every",
    "filter",
    "find",
    "findIndex",
    "forEach",
    "includes",
    "indexOf",
    "join",
    "keys",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "slice",
    "some",
    "values",
]
const ARRAY_MUTATION_METHODS = [
    "copyWithin",
    "fill",
    "reverse",
    "sort",
]
const instances = new Map()

/**
 * Installs `Array.prototype` methods into the given `ArrayRecord`.
 *
 * @param {class} ArrayRecord - The class to install.
 * @param {boolean} readOnly - The flag to indicate whether the `ArrayRecord`
 *  class is read-only or not.
 * @returns {class} Pass through the `ArrayRecord` class.
 * @private
 */
function installArrayMethods(ArrayRecord, readOnly) {
    for (const key of ARRAY_METHODS) {
        //eslint-disable-next-line no-prototype-builtins
        if (Array.prototype.hasOwnProperty(key)) {
            Object.defineProperty(
                ArrayRecord.prototype,
                key,
                Object.getOwnPropertyDescriptor(Array.prototype, key)
            )
        }
    }

    if (!readOnly) {
        for (const key of ARRAY_MUTATION_METHODS) {
            //eslint-disable-next-line no-prototype-builtins
            if (Array.prototype.hasOwnProperty(key)) {
                Object.defineProperty(
                    ArrayRecord.prototype,
                    key,
                    Object.getOwnPropertyDescriptor(Array.prototype, key)
                )
            }
        }
    }

    return ArrayRecord
}

/**
 * Generates the initialization code of an `ArrayRecord` class.
 *
 * @param {Accessor} accessor - The accessor to access elements.
 * @param {number[]} indixes - The array of indices.
 * @returns {string} The initialization code.
 * @private
 */
function initCode(accessor, indixes) {
    if (!accessor.hasInitCode) {
        return ""
    }

    return `this[s.subRecords] = Object.create(null)
        ${
    indixes
        .map(i => accessor.initCode(i, i * accessor.bits))
        .join("\n        ")
}
        Object.freeze(this[s.subRecords])`
}

/**
 * Generates the getter/setter code of an `ArrayRecord` class.
 *
 * @param {Accessor} accessor - The accessor to access elements.
 * @param {number[]} indixes - The array of indices.
 * @returns {string} The getter/setter code.
 * @private
 */
function propertiesCode(accessor, indixes) {
    return indixes
        .map(i => accessor.propertyCode(i, i * accessor.bits))
        .join("\n    ")
}

/**
 * Generates the `Symbol.iterator` method code of an `ArrayRecord` class.
 *
 * @param {number[]} indixes - The array of indices.
 * @returns {string} The `Symbol.iterator` method code.
 * @private
 */
function iteratorCode(indixes) {
    return indixes
        .map(i => `yield this[${i}]`)
        .join("\n        ")
}

/**
 * Generates the `keys` method code of an `ArrayRecord` class.
 *
 * @param {number[]} indixes - The array of indices.
 * @returns {string} The `keys` method code.
 * @private
 */
function keysCode(indixes) {
    return indixes
        .map(index => `yield ${index}`)
        .join("\n        ")
}

/**
 * Defines a new `ArrayRecord` class.
 *
 * @param {Accessor} accessor - The accessor to access elements.
 * @param {number} length - The number of elements.
 * @returns {class} Defined class.
 * @private
 */
function defineArrayRecord(accessor, length) {
    const className = `ArrayRecord$${accessor.name}$${length}`
    const bitLength = accessor.bits * length
    const byteLength = (bitLength >> 3) + ((bitLength & 0x07) ? 1 : 0)
    const indixes = Array.from({length}, (_, index) => index)
    const TextEncoder = registry.getTextEncoder()
    const RecordPool = ("Record" in accessor) ?
        {[accessor.uid]: accessor.Record} :
        null

    const ArrayRecord =
        Function("assert", "BinaryRecord", "TextEncoder", "RecordPool", `
"use strict"
const s = BinaryRecord.symbols
return class ${className} extends BinaryRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset)
        ${initCode(accessor, indixes)}
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
        ${keysCode(indixes)}
    }

    get length() {
        return ${length}
    }

    ${propertiesCode(accessor, indixes)}

    toJSON() {
        return Array.from(this)
    }

    toString() {
        return this.join(",")
    }

    * [Symbol.iterator]() {
        ${iteratorCode(indixes)}
    }
}`)(assert, BinaryRecord, TextEncoder, RecordPool)

    return installArrayMethods(ArrayRecord, accessor.readOnly)
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.getArrayRecord = function getArrayRecord(accessor, length) {
    assert.integer(length, "length")
    assert.gte(length, 1, "length")

    const key = `${accessor.name}$${length}`

    let ArrayRecord = instances.get(key)
    if (ArrayRecord == null) {
        ArrayRecord = defineArrayRecord(accessor, length)
        instances.set(key, ArrayRecord)
    }
    return ArrayRecord
}
