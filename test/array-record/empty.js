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
const Buffer = require("safe-buffer").Buffer
const bre = require("../../")
const BinaryRecord = bre.BinaryRecord
const defineArrayRecord = bre.defineArrayRecord
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineArrayRecord:", () => {
    describe("Record with 0 length", () => {
        const Record = defineArrayRecord("int32", 0)
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property", () => {
            assert(record.length === 0)
        })

        it("should not have indexers", () => {
            assert(record[0] === undefined)
        })

        it("should not be writable", () => {
            assert(thrownMessage(() => {
                record[0] = 1
            }) === "Can't add property 0, object is not extensible")
        })

        //
        // Meta Informations
        //

        it("should have bitLength 0", () => {
            assert(BinaryRecord.bitLength(record) === 0)
        })

        it("should have byteLength 0", () => {
            assert(BinaryRecord.byteLength(record) === 0)
        })

        it("should have keys []", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                [])
        })

        it("should have values []", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [])
        })

        it("should have entries []", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [])
        })
    })
})
