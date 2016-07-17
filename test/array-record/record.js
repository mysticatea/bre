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
const Buffer = require("buffer").Buffer
const bre = require("../../")
const BinaryRecord = bre.BinaryRecord
const defineArrayRecord = bre.defineArrayRecord
const defineObjectRecord = bre.defineObjectRecord
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineArrayRecord:", () => {
    describe("Record with record and 2", () => {
        const SubRecord = defineObjectRecord("SubRecord", [
            {type: "uint8", name: "a"},
            {type: "uint8", name: "b"},
        ])
        const Record = defineArrayRecord(SubRecord, 2)
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property", () => {
            assert(record.length === 2)
        })

        it("should read the 1st..4th bytes", () => {
            assert(record[0].a === 1)
            assert(record[0].b === 2)
            assert(record[1].a === 3)
            assert(record[1].b === 4)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record[0].a = 135
            record[0].b = 101
            record[1].a = 67
            record[1].b = 33
            assert(record[0].a === 135)
            assert(record[0].b === 101)
            assert(record[1].a === 67)
            assert(record[1].b === 33)
            assert(buffer[0] === 0x87)
            assert(buffer[1] === 0x65)
            assert(buffer[2] === 0x43)
            assert(buffer[3] === 0x21)
            assert(buffer[4] === 0x05)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 1)
            })

            it("should have length property", () => {
                assert(record.length === 2)
            })

            it("should read the 2nd..5th bytes", () => {
                assert(record[0].a === 2)
                assert(record[0].b === 3)
                assert(record[1].a === 4)
                assert(record[1].b === 5)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0].a = 135
                record[0].b = 101
                record[1].a = 67
                record[1].b = 33
                assert(record[0].a === 135)
                assert(record[0].b === 101)
                assert(record[1].a === 67)
                assert(record[1].b === 33)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x87)
                assert(buffer[2] === 0x65)
                assert(buffer[3] === 0x43)
                assert(buffer[4] === 0x21)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 32", () => {
            assert(BinaryRecord.bitLength(record) === 32)
        })

        it("should have byteLength 4", () => {
            assert(BinaryRecord.byteLength(record) === 4)
        })

        it("should have keys [0,1]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                [0, 1])
        })

        it("should have values [{a:1,b:2}, {a:3,b:4}]", () => {
            const actual = Array.from(BinaryRecord.values(record))
            assert(actual[0].a === 1)
            assert(actual[0].b === 2)
            assert(actual[1].a === 3)
            assert(actual[1].b === 4)
        })

        it("should have entries [[0, {a:1,b:2}], [1, {a:3,b:4}]]", () => {
            const actual = Array.from(BinaryRecord.entries(record))
            assert(actual[0][0] === 0)
            assert(actual[0][1].a === 1)
            assert(actual[0][1].b === 2)
            assert(actual[1][0] === 1)
            assert(actual[1][1].a === 3)
            assert(actual[1][1].b === 4)
        })

        //
        // Boundary Check
        //

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, -1)
            }) === "'byteOffset' should be '>=0', but got -1.")
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, 2)
            }) === "'buffer' should have enough size for the offset and size of this record (2 + 4 = 6), but got 5.")
        })
    })
})
