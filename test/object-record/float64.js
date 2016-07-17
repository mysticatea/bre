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
    describe("Record with 1 'float64' field", () => {
        const Record = defineObjectRecord("Float64_1", [
            {type: "float64", name: "a"},
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

        it("should read the 1st..8th bytes", () => {
            assert(record.a === 1.40159977307889e-309)
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

        it("should write the 1st..8th bytes", () => {
            record.a = -1.2313300687736946e+303
            assert(record.a === -1.2313300687736946e+303)
            assert(buffer[0] === 0xFE)
            assert(buffer[1] === 0xDC)
            assert(buffer[2] === 0xBA)
            assert(buffer[3] === 0x98)
            assert(buffer[4] === 0x76)
            assert(buffer[5] === 0x54)
            assert(buffer[6] === 0x32)
            assert(buffer[7] === 0x10)
            assert(buffer[8] === 0x08)
            assert(buffer[9] === 0x09)
            assert(buffer[10] === 0x0A)
            assert(buffer[11] === 0x0B)
            assert(buffer[12] === 0x0C)
            assert(buffer[13] === 0x0D)
            assert(buffer[14] === 0x0E)
            assert(buffer[15] === 0x0F)
        })

        describe("with offset 8", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 8)
            })

            it("should read the 9th..16th bytes", () => {
                assert(record.a === 5.924543410270741e-270)
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

            it("should write the 9th..16th bytes", () => {
                record.a = -1.2313300687736946e+303
                assert(record.a === -1.2313300687736946e+303)
                assert(buffer[0] === 0x00)
                assert(buffer[1] === 0x01)
                assert(buffer[2] === 0x02)
                assert(buffer[3] === 0x03)
                assert(buffer[4] === 0x04)
                assert(buffer[5] === 0x05)
                assert(buffer[6] === 0x06)
                assert(buffer[7] === 0x07)
                assert(buffer[8] === 0xFE)
                assert(buffer[9] === 0xDC)
                assert(buffer[10] === 0xBA)
                assert(buffer[11] === 0x98)
                assert(buffer[12] === 0x76)
                assert(buffer[13] === 0x54)
                assert(buffer[14] === 0x32)
                assert(buffer[15] === 0x10)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 64", () => {
            assert(BinaryRecord.bitLength(record) === 64)
        })

        it("should have byteLength 8", () => {
            assert(BinaryRecord.byteLength(record) === 8)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [1.40159977307889e-309]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [1.40159977307889e-309])
        })

        it("should have entries [[a, 1.40159977307889e-309]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 1.40159977307889e-309]])
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
                Record.view(buffer, 9)
            }) === "'buffer' should have enough size for the offset and size of this record (9 + 8 = 17), but got 16.")
        })
    })
})
