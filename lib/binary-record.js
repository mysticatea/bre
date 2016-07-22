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

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const BUFFER = Symbol("buffer")
const SUB_RECORDS = Symbol("subRecords")

/**
 * BinaryRecord class is the base class for all binary record types.
 *
 * This class cannot be directly instantiated.
 * It needs to define subclasses with {@link module:bre.defineObjectRecord} or
 * {@link module:bre.defineArrayRecord}.
 *
 * @memberof module:bre
 */
class BinaryRecord {
    /**
     * This class cannot be directly instantiated. It needs to define subclasses
     * with `bre.defineObjectRecord` or `bre.defineArrayRecord`.
     *
     * @param {ArrayBuffer|DataView|TypedArray} buffer - The buffer to wrap.
     * @param {number|undefined} byteOffset - The start position to wrap.
     * @private
     */
    constructor(buffer, byteOffset) {
        if (byteOffset === undefined) {
            byteOffset = 0  //eslint-disable-line no-param-reassign
        }

        assert(
            this.constructor !== BinaryRecord,
            "'BinaryRecord' class cannot be directly instantiated. " +
            "Use via 'bre.defineObjectRecord' or 'bre.defineArrayRecord'."
        )
        assert.integer(
            this.constructor.bitLength,
            `${this.constructor.name}.bitLength`
        )
        assert.integer(
            this.constructor.byteLength,
            `${this.constructor.name}.byteLength`
        )
        assert.function(
            this.constructor.keys,
            `${this.constructor.name}.keys`
        )

        // Strip Buffer of Node.js
        // Buffer of Node.js is one of ArrayBuufer's view.
        const rawBuffer = ArrayBuffer.isView(buffer) ? buffer.buffer : buffer

        assert.instanceOf(rawBuffer, ArrayBuffer, "buffer")
        assert.integer(byteOffset, "byteOffset")
        assert.gte(byteOffset, 0, "byteOffset")

        const byteLength = this.constructor.byteLength
        assert(
            buffer.byteLength >= byteOffset + byteLength,
            "'buffer' should have enough size for the offset and size of this" +
            ` record (${byteOffset} + ${byteLength} = ` +
            `${byteOffset + byteLength}), but got ${buffer.byteLength}.`
        )

        this[BUFFER] = new DataView(
            rawBuffer,
            buffer.byteOffset + byteOffset,
            byteLength
        )
    }

    /**
     * Gets length in bits of the given record.
     *
     *     const bits = bre.BinaryRecord.bitLength(record1)
     *     console.log(bits)  // => 16
     *
     * @param {module:bre.BinaryRecord} record - The record to get.
     * @returns {number} The length in bits of the record.
     */
    static bitLength(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.bitLength
    }

    /**
     * Gets length in bytes of the given record.
     *
     *     const bytes = bre.BinaryRecord.byteLength(record1)
     *     console.log(bytes)  // => 2
     *
     * @param {module:bre.BinaryRecord} record - The record to get.
     * @returns {number} The length in bytes of the record.
     */
    static byteLength(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.byteLength
    }

    /**
     * Gets the keys of the given record.
     *
     * [Object.keys](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
     * does not work for records because the properties of records are
     * getter/setter pairs in the prototype. Use this method instead.
     *
     *     const keys = bre.BinaryRecord.keys(record1)
     *     console.log(keys)  // => ["a", "b"]
     *
     * @param {module:bre.BinaryRecord} record - The record to get.
     * @returns {IterableIterator<string>} The keys of the record.
     */
    static keys(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.keys()
    }

    /**
     * Gets the values of the given record.
     *
     * [Object.values](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/values)
     * does not work for records because the properties of records are
     * getter/setter pairs in the prototype. Use this method instead.
     *
     *     const values = bre.BinaryRecord.values(record1)
     *     console.log(values)  // => [1, 10]
     *
     * @param {module:bre.BinaryRecord} record - The record to get.
     * @returns {IterableIterator<any>} The values of the record.
     */
    static* values(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        for (const key of record.constructor.keys()) {
            yield record[key]
        }
    }

    /**
     * Gets the key-value pairs of the given record.
     *
     * [Object.entries](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
     * does not work for records because the properties of records are
     * getter/setter pairs in the prototype. Use this method instead.
     *
     *     const entries = bre.BinaryRecord.entries(record1)
     *     console.log(entries)  // => [ ["a", 1], ["b", 10] ]
     *
     * @param {module:bre.BinaryRecord} record - The record to get.
     * @returns {IterableIterator<any[]>} The key-value pairs of the record.
     */
    static* entries(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        for (const key of record.constructor.keys()) {
            yield [key, record[key]]
        }
    }
}

BinaryRecord.symbols = {
    buffer: BUFFER,
    subRecords: SUB_RECORDS,
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.BinaryRecord = BinaryRecord
