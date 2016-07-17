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
    describe("Record with 1 'float32' field", () => {
        const Record = defineObjectRecord("Float32_1", [
            {type: "float32", name: "a"},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from([
                0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
                0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F,
            ])
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..4th bytes", () => {
            assert(record.a === 9.25571648671185e-41)
            assert(buffer[0] === 0x00)
            assert(buffer[1] === 0x01)
            assert(buffer[2] === 0x02)
            assert(buffer[3] === 0x03)
            assert(buffer[4] === 0x04)
            assert(buffer[5] === 0x05)
            assert(buffer[6] === 0x06)
            assert(buffer[7] === 0x07)
            assert(buffer[8] === 0x08)
            assert(buffer[9] === 0x09)
            assert(buffer[10] === 0x0A)
            assert(buffer[11] === 0x0B)
            assert(buffer[12] === 0x0C)
            assert(buffer[13] === 0x0D)
            assert(buffer[14] === 0x0E)
            assert(buffer[15] === 0x0F)
        })

        it("should write the 1st..4th bytes", () => {
            record.a = -1.7247772618169884e-34
            assert(record.a === -1.7247772618169884e-34)
            assert(buffer[0] === 0x87)
            assert(buffer[1] === 0x65)
            assert(buffer[2] === 0x43)
            assert(buffer[3] === 0x21)
            assert(buffer[4] === 0x04)
            assert(buffer[5] === 0x05)
            assert(buffer[6] === 0x06)
            assert(buffer[7] === 0x07)
            assert(buffer[8] === 0x08)
            assert(buffer[9] === 0x09)
            assert(buffer[10] === 0x0A)
            assert(buffer[11] === 0x0B)
            assert(buffer[12] === 0x0C)
            assert(buffer[13] === 0x0D)
            assert(buffer[14] === 0x0E)
            assert(buffer[15] === 0x0F)
        })

        describe("with offset 12", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 12)
            })

            it("should read the 13th..16th bytes", () => {
                assert(record.a === 1.086647549051262e-31)
                assert(buffer[0] === 0x00)
                assert(buffer[1] === 0x01)
                assert(buffer[2] === 0x02)
                assert(buffer[3] === 0x03)
                assert(buffer[4] === 0x04)
                assert(buffer[5] === 0x05)
                assert(buffer[6] === 0x06)
                assert(buffer[7] === 0x07)
                assert(buffer[8] === 0x08)
                assert(buffer[9] === 0x09)
                assert(buffer[10] === 0x0A)
                assert(buffer[11] === 0x0B)
                assert(buffer[12] === 0x0C)
                assert(buffer[13] === 0x0D)
                assert(buffer[14] === 0x0E)
                assert(buffer[15] === 0x0F)
            })

            it("should write the 13th..16th bytes", () => {
                record.a = -1.7247772618169884e-34
                assert(record.a === -1.7247772618169884e-34)
                assert(buffer[0] === 0x00)
                assert(buffer[1] === 0x01)
                assert(buffer[2] === 0x02)
                assert(buffer[3] === 0x03)
                assert(buffer[4] === 0x04)
                assert(buffer[5] === 0x05)
                assert(buffer[6] === 0x06)
                assert(buffer[7] === 0x07)
                assert(buffer[8] === 0x08)
                assert(buffer[9] === 0x09)
                assert(buffer[10] === 0x0A)
                assert(buffer[11] === 0x0B)
                assert(buffer[12] === 0x87)
                assert(buffer[13] === 0x65)
                assert(buffer[14] === 0x43)
                assert(buffer[15] === 0x21)
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

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [9.25571648671185e-41]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [9.25571648671185e-41])
        })

        it("should have entries [[a, 9.25571648671185e-41]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 9.25571648671185e-41]])
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
                Record.view(buffer, 13)
            }) === "'buffer' should have enough size for the offset and size of this record (13 + 4 = 17), but got 16.")
        })
    })
})
