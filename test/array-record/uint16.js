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
    describe("Record with 'uint16' and 2", () => {
        const Record = defineArrayRecord("uint16", 2)
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
            assert(record[0] === 258)
            assert(record[1] === 772)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record[0] = 34661
            record[1] = 17185
            assert(record[0] === 34661)
            assert(record[1] === 17185)
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
                assert(record[0] === 515)
                assert(record[1] === 1029)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0] = 34661
                record[1] = 17185
                assert(record[0] === 34661)
                assert(record[1] === 17185)
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

        it("should have values [258,772]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [258, 772])
        })

        it("should have entries [[0,258],[1,772]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [[0, 258], [1, 772]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 65535", () => {
            for (const k of record.keys()) {
                record[k] = 65535
                assert(record[k] === 65535)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert(record[k] === 0)
            }
        })

        it("should throw if it wrote 65536 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = 65536
                }) === `'${k}' should be within '0..65535', but got 65536.`)
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert(thrownMessage(() => {
                    record[k] = -1
                }) === `'${k}' should be within '0..65535', but got -1.`)
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
