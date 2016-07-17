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
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineArrayRecord:", () => {
    describe("Record with 'bit3' and 5", () => {
        const Record = defineArrayRecord("bit3", 5)
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
            assert(record.length === 5)
        })

        it("should read the 1st..2nd bytes", () => {
            assert(record[0] === 0)
            assert(record[1] === 0)
            assert(record[2] === 2)
            assert(record[3] === 0)
            assert(record[4] === 1)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record[0] = 4
            record[1] = 1
            record[2] = 6
            record[3] = 6
            record[4] = 2
            assert(record[0] === 4)
            assert(record[1] === 1)
            assert(record[2] === 6)
            assert(record[3] === 6)
            assert(record[4] === 2)
            assert(buffer[0] === 0x87)
            assert(buffer[1] === 0x64)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 3)
            })

            it("should have length property", () => {
                assert(record.length === 5)
            })

            it("should read the 4th..5th bytes", () => {
                assert(record[0] === 0)
                assert(record[1] === 1)
                assert(record[2] === 0)
                assert(record[3] === 0)
                assert(record[4] === 2)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record[0] = 4
                record[1] = 1
                record[2] = 6
                record[3] = 6
                record[4] = 2
                assert(record[0] === 4)
                assert(record[1] === 1)
                assert(record[2] === 6)
                assert(record[3] === 6)
                assert(record[4] === 2)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x87)
                assert(buffer[4] === 0x65)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 15", () => {
            assert(BinaryRecord.bitLength(record) === 15)
        })

        it("should have byteLength 2", () => {
            assert(BinaryRecord.byteLength(record) === 2)
        })

        it("should have keys [0,1,2,3,4]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                [0, 1, 2, 3, 4])
        })

        it("should have values [0,0,2,0,1]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [0, 0, 2, 0, 1])
        })

        it("should have entries [[0,0],[1,0],[2,2],[3,0],[4,1]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [[0, 0], [1, 0], [2, 2], [3, 0], [4, 1]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 7", () => {
            for (const k of record.keys()) {
                record[k] = 7
                assert(record[k] === 7)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert(record[k] === 0)
            }
        })

        it("should throw if it wrote 8 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = 8
                }) === `'${k}' should be within '0..7', but got 8.`)
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = -1
                }) === `'${k}' should be within '0..7', but got -1.`)
            }
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, -1)
            }) === "'byteOffset' should be '>=0', but got -1.")
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, 4)
            }) === "'buffer' should have enough size for the offset and size of this record (4 + 2 = 6), but got 5.")
        })
    })
})
