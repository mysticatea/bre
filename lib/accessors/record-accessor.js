/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("../assert")
const BinaryRecord = require("../binary-record").BinaryRecord
const Accessor = require("./accessor").Accessor

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

const instances = new Map()
const uid = (() => {
    let n = 0
    return () => {
        const n1 = (n = ((n + 1) & 0xFFFF)).toString(16)
        const n2 = Date.now().toString(16)
        return `_${n2}_${n1}`
    }
})()

class RecordAccessor extends Accessor {
    constructor(Record) {
        assert.function(Record, "Record")
        assert(
            Record.prototype instanceof BinaryRecord,
            "'Record' should be a sub type of BinaryRecord, " +
            `but got ${Record.name}.`
        )
        super(
            Record.name,
            Record.bitLength(),
            {hasInitCode: true, readOnly: true}
        )
        this.uid = uid()
        this.Record = Record
    }

    initCode(name, bitOffset) {
        assert.numberOrString(name, "name")
        assert.bitOffsetX8(bitOffset, this.name)

        const byteOffset = bitOffset >> 3

        return (
            `this[s.subRecords]._${name} = ` +
            `RecordPool.${this.uid}.view(this[s.buffer], ${byteOffset})`
        )
    }

    propertyCode(name, _bitOffset) {
        assert.numberOrString(name, "name")

        return `get ${name}() {
        return this[s.subRecords]._${name}
    }`
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

exports.record = (Record) => {
    let accessor = instances.get(Record)

    if (accessor == null) {
        accessor = new RecordAccessor(Record)
        instances.set(Record, accessor)
    }

    return accessor
}
