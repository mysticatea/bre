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
    describe("Record with 'int8' and 4", () => {
        const Record = defineArrayRecord("int8", 4)
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
            assert(record.length === 4)
        })

        it("should read the 1st..4th bytes", () => {
            assert(record[0] === 1)
            assert(record[1] === 2)
            assert(record[2] === 3)
            assert(record[3] === 4)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record[0] = -121
            record[1] = 101
            record[2] = 67
            record[3] = 33
            assert(record[0] === -121)
            assert(record[1] === 101)
            assert(record[2] === 67)
            assert(record[3] === 33)
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
                assert(record.length === 4)
            })

            it("should read the 2nd..5th bytes", () => {
                assert(record[0] === 2)
                assert(record[1] === 3)
                assert(record[2] === 4)
                assert(record[3] === 5)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0] = -121
                record[1] = 101
                record[2] = 67
                record[3] = 33
                assert(record[0] === -121)
                assert(record[1] === 101)
                assert(record[2] === 67)
                assert(record[3] === 33)
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

        it("should have keys [0,1,2,3]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                [0, 1, 2, 3])
        })

        it("should have values [1,2,3,4]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [1, 2, 3, 4])
        })

        it("should have entries [[0,1],[1,2],[2,3],[3,4]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [[0, 1], [1, 2], [2, 3], [3, 4]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 127", () => {
            for (const k of record.keys()) {
                record[k] = 127
                assert(record[k] === 127)
            }
        })

        it("should be ok if it wrote -128", () => {
            for (const k of record.keys()) {
                record[k] = -128
                assert(record[k] === -128)
            }
        })

        it("should throw if it wrote 128 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = 128
                }) === `'${k}' should be within '-128..127', but got 128.`)
            }
        })

        it("should throw if it wrote -129 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = -129
                }) === `'${k}' should be within '-128..127', but got -129.`)
            }
        })

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
