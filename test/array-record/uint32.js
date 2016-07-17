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
    describe("Record with 'uint32' and 2", () => {
        const Record = defineArrayRecord("uint32", 2)
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
            assert(record.length === 2)
        })

        it("should read the 1st..8th bytes", () => {
            assert(record[0] === 16909060)
            assert(record[1] === 84281096)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
            assert(buffer[5] === 0x06)
            assert(buffer[6] === 0x07)
            assert(buffer[7] === 0x08)
            assert(buffer[8] === 0x09)
        })

        it("should write the 1st..4th bytes", () => {
            record[0] = 4275878552
            record[1] = 1985229328
            assert(record[0] === 4275878552)
            assert(record[1] === 1985229328)
            assert(buffer[0] === 0xFE)
            assert(buffer[1] === 0xDC)
            assert(buffer[2] === 0xBA)
            assert(buffer[3] === 0x98)
            assert(buffer[4] === 0x76)
            assert(buffer[5] === 0x54)
            assert(buffer[6] === 0x32)
            assert(buffer[7] === 0x10)
            assert(buffer[8] === 0x09)
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
                assert(record[0] === 33752069)
                assert(record[1] === 101124105)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
                assert(buffer[5] === 0x06)
                assert(buffer[6] === 0x07)
                assert(buffer[7] === 0x08)
                assert(buffer[8] === 0x09)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0] = 4275878552
                record[1] = 1985229328
                assert(record[0] === 4275878552)
                assert(record[1] === 1985229328)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0xFE)
                assert(buffer[2] === 0xDC)
                assert(buffer[3] === 0xBA)
                assert(buffer[4] === 0x98)
                assert(buffer[5] === 0x76)
                assert(buffer[6] === 0x54)
                assert(buffer[7] === 0x32)
                assert(buffer[8] === 0x10)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 64", () => {
            assert(BinaryRecord.bitLength(record) === 64)
        })

        it("should have byteLength 4", () => {
            assert(BinaryRecord.byteLength(record) === 8)
        })

        it("should have keys [0,1]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                [0, 1])
        })

        it("should have values [16909060,84281096]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [16909060, 84281096])
        })

        it("should have entries [[0,16909060],[1,84281096]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [[0, 16909060], [1, 84281096]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 4294967295", () => {
            for (const k of record.keys()) {
                record[k] = 4294967295
                assert(record[k] === 4294967295)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert(record[k] === 0)
            }
        })

        it("should throw if it wrote 4294967296 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = 4294967296
                }) === `'${k}' should be within '0..4294967295', but got 4294967296.`)
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = -1
                }) === `'${k}' should be within '0..4294967295', but got -1.`)
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
            }) === "'buffer' should have enough size for the offset and size of this record (2 + 8 = 10), but got 9.")
        })
    })
})
