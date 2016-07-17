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

class BinaryRecord {
    constructor(buffer, byteOffset) {
        if (byteOffset === undefined) {
            byteOffset = 0  //eslint-disable-line no-param-reassign
        }

        assert(
            this.constructor !== BinaryRecord,
            "'BinaryRecord' class cannot be directly instantiated. " +
            "Use via 'bre.defineObjectRecord' or 'bre.defineArrayRecord'."
        )
        assert.function(
            this.constructor.bitLength,
            `${this.constructor.name}.bitLength`
        )
        assert.function(
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

        const byteLength = this.constructor.byteLength()
        assert(
            buffer.byteLength >= byteOffset + byteLength,
            "'buffer' should have enough size for the offset and size of this" +
            ` record (${byteOffset} + ${byteLength} = ` +
            `${byteOffset + byteLength}), but got ${buffer.byteLength}.`
        )

        this[BUFFER] = new DataView(
            rawBuffer,
            buffer.byteOffset + byteOffset,
            byteLength)
    }

    static bitLength(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.bitLength()
    }

    static byteLength(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.byteLength()
    }

    static keys(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        return record.constructor.keys()
    }

    static* values(record) {
        assert.instanceOf(record, BinaryRecord, "record")

        for (const key of record.constructor.keys()) {
            yield record[key]
        }
    }

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
