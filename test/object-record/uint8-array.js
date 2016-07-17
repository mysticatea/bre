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
const defineObjectRecord = bre.defineObjectRecord

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord:", () => {
    describe("Record with 1 uint8[2][3] field", () => {
        const Record = defineObjectRecord("Record", [
            {type: "uint8[2][3]", name: "a"},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property as 2", () => {
            assert(record.a.length === 2)
        })

        it(", each element should have length property as 3", () => {
            assert(record.a[0].length === 3)
            assert(record.a[1].length === 3)
        })

        it("should read the 1st..6th bytes", () => {
            assert(record.a[0][0] === 1)
            assert(record.a[0][1] === 2)
            assert(record.a[0][2] === 3)
            assert(record.a[1][0] === 4)
            assert(record.a[1][1] === 5)
            assert(record.a[1][2] === 6)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
            assert(buffer[5] === 0x06)
        })

        it("should write the 1st..6th bytes", () => {
            record.a[0][0] = 11
            record.a[0][1] = 12
            record.a[0][2] = 13
            record.a[1][0] = 14
            record.a[1][1] = 15
            record.a[1][2] = 16
            assert(record.a[0][0] === 11)
            assert(record.a[0][1] === 12)
            assert(record.a[0][2] === 13)
            assert(record.a[1][0] === 14)
            assert(record.a[1][1] === 15)
            assert(record.a[1][2] === 16)
            assert(buffer[0] === 0x0B)
            assert(buffer[1] === 0x0C)
            assert(buffer[2] === 0x0D)
            assert(buffer[3] === 0x0E)
            assert(buffer[4] === 0x0F)
            assert(buffer[5] === 0x10)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 48", () => {
            assert(BinaryRecord.bitLength(record) === 48)
        })

        it("should have byteLength 6", () => {
            assert(BinaryRecord.byteLength(record) === 6)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [[[1,2,3], [4,5,6]]]", () => {
            const actual = Array.from(BinaryRecord.values(record))
            assert(actual[0][0][0] === 1)
            assert(actual[0][0][1] === 2)
            assert(actual[0][0][2] === 3)
            assert(actual[0][1][0] === 4)
            assert(actual[0][1][1] === 5)
            assert(actual[0][1][2] === 6)
        })

        it("should have entries [[a, [[1,2,3], [4,5,6]]]]", () => {
            const actual = Array.from(BinaryRecord.entries(record))
            assert(actual[0][0] === "a")
            assert(actual[0][1][0][0] === 1)
            assert(actual[0][1][0][1] === 2)
            assert(actual[0][1][0][2] === 3)
            assert(actual[0][1][1][0] === 4)
            assert(actual[0][1][1][1] === 5)
            assert(actual[0][1][1][2] === 6)
        })
    })
})
