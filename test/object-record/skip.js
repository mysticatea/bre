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

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord:", () => {
    describe("Record with 2 'uint8' fields and skip", () => {
        const Record = defineObjectRecord("Skip", [
            {type: "uint8", name: "a"},
            {skip: 8},
            {type: "uint8", name: "b"},
            {skip: 8},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st and 3rd bytes", () => {
            assert(record.a === 1)
            assert(record.b === 3)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
        })

        it("should write the 1st and 3rd bytes", () => {
            record.a = 16
            record.b = 32
            assert(record.a === 16)
            assert(record.b === 32)
            assert(buffer[0] === 0x10)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x20)
            assert(buffer[3] === 0x04)
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

        it("should have values [1,3]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [1, 3])
        })

        it("should have entries [[a, 1], [b, 3]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 1], ["b", 3]])
        })
    })
})
