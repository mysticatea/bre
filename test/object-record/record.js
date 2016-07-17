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
const defineObjectRecord = bre.defineObjectRecord
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord:", () => {
    describe("Record with 2 sub-record fields", () => {
        const SubRecord = defineObjectRecord("SubRecord", [
            {type: "uint8", name: "a"},
            {type: "uint8", name: "b"},
        ])
        const Record = defineObjectRecord("Record", [
            {type: SubRecord, name: "a"},
            {type: SubRecord, name: "b"},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..4th bytes", () => {
            assert(record.a.a === 1)
            assert(record.a.b === 2)
            assert(record.b.a === 3)
            assert(record.b.b === 4)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record.a.a = 135
            record.a.b = 101
            record.b.a = 67
            record.b.b = 33
            assert(record.a.a === 135)
            assert(record.a.b === 101)
            assert(record.b.a === 67)
            assert(record.b.b === 33)
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

            it("should read the 2nd..5th bytes", () => {
                assert(record.a.a === 2)
                assert(record.a.b === 3)
                assert(record.b.a === 4)
                assert(record.b.b === 5)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record.a.a = 135
                record.a.b = 101
                record.b.a = 67
                record.b.b = 33
                assert(record.a.a === 135)
                assert(record.a.b === 101)
                assert(record.b.a === 67)
                assert(record.b.b === 33)
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

        it("should have keys [a,b]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a", "b"])
        })

        it("should have values [{a:1,b:2}, {a:3,b:4}]", () => {
            const actual = Array.from(BinaryRecord.values(record))
            assert(actual[0].a === 1)
            assert(actual[0].b === 2)
            assert(actual[1].a === 3)
            assert(actual[1].b === 4)
        })

        it("should have entries [[a, {a:1,b:2}], [b, {a:3,b:4}]]", () => {
            const actual = Array.from(BinaryRecord.entries(record))
            assert(actual[0][0] === "a")
            assert(actual[0][1].a === 1)
            assert(actual[0][1].b === 2)
            assert(actual[1][0] === "b")
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
