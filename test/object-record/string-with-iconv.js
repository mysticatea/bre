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
const setTextEncoder = bre.setTextEncoder
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord with IConvTextEncoder:", () => {
    setTextEncoder(require("../../lib/text-encoders/iconv"))

    describe("Record with 1 'string(15)' field", () => {
        const Record = defineObjectRecord("String15_1", [
            {type: "string(15)", name: "a"},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from("Hello World!    ")
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..15th bytes", () => {
            assert(record.a === "Hello World!   ")
            assert(buffer[0] === 0x48)
            assert(buffer[1] === 0x65)
            assert(buffer[2] === 0x6C)
            assert(buffer[3] === 0x6C)
            assert(buffer[4] === 0x6F)
            assert(buffer[5] === 0x20)
            assert(buffer[6] === 0x57)
            assert(buffer[7] === 0x6F)
            assert(buffer[8] === 0x72)
            assert(buffer[9] === 0x6C)
            assert(buffer[10] === 0x64)
            assert(buffer[11] === 0x21)
            assert(buffer[12] === 0x20)
            assert(buffer[13] === 0x20)
            assert(buffer[14] === 0x20)
            assert(buffer[15] === 0x20)
        })

        it("should write the 1st..15th bytes", () => {
            record.a = "This is a pen."
            assert(record.a === "This is a pen.")
            assert(buffer[0] === 0x54)
            assert(buffer[1] === 0x68)
            assert(buffer[2] === 0x69)
            assert(buffer[3] === 0x73)
            assert(buffer[4] === 0x20)
            assert(buffer[5] === 0x69)
            assert(buffer[6] === 0x73)
            assert(buffer[7] === 0x20)
            assert(buffer[8] === 0x61)
            assert(buffer[9] === 0x20)
            assert(buffer[10] === 0x70)
            assert(buffer[11] === 0x65)
            assert(buffer[12] === 0x6E)
            assert(buffer[13] === 0x2E)
            assert(buffer[14] === 0x00)
            assert(buffer[15] === 0x20)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 1)
            })

            it("should read the 2nd..16th bytes", () => {
                assert(record.a === "ello World!    ")
                assert(buffer[0] === 0x48)
                assert(buffer[1] === 0x65)
                assert(buffer[2] === 0x6C)
                assert(buffer[3] === 0x6C)
                assert(buffer[4] === 0x6F)
                assert(buffer[5] === 0x20)
                assert(buffer[6] === 0x57)
                assert(buffer[7] === 0x6F)
                assert(buffer[8] === 0x72)
                assert(buffer[9] === 0x6C)
                assert(buffer[10] === 0x64)
                assert(buffer[11] === 0x21)
                assert(buffer[12] === 0x20)
                assert(buffer[13] === 0x20)
                assert(buffer[14] === 0x20)
                assert(buffer[15] === 0x20)
            })

            it("should write the 2nd..16th bytes", () => {
                record.a = "This is a pen."
                assert(record.a === "This is a pen.")
                assert(buffer[0] === 0x48)
                assert(buffer[1] === 0x54)
                assert(buffer[2] === 0x68)
                assert(buffer[3] === 0x69)
                assert(buffer[4] === 0x73)
                assert(buffer[5] === 0x20)
                assert(buffer[6] === 0x69)
                assert(buffer[7] === 0x73)
                assert(buffer[8] === 0x20)
                assert(buffer[9] === 0x61)
                assert(buffer[10] === 0x20)
                assert(buffer[11] === 0x70)
                assert(buffer[12] === 0x65)
                assert(buffer[13] === 0x6E)
                assert(buffer[14] === 0x2E)
                assert(buffer[15] === 0x00)
            })
        })

        //
        // Internationalization
        //

        it("should be possible to address Japanese", () => {
            record.a = "こんにちは"
            assert(record.a === "こんにちは")
            assert(buffer[0] === 0xE3)
            assert(buffer[1] === 0x81)
            assert(buffer[2] === 0x93)
            assert(buffer[3] === 0xE3)
            assert(buffer[4] === 0x82)
            assert(buffer[5] === 0x93)
            assert(buffer[6] === 0xE3)
            assert(buffer[7] === 0x81)
            assert(buffer[8] === 0xAb)
            assert(buffer[9] === 0xE3)
            assert(buffer[10] === 0x81)
            assert(buffer[11] === 0xA1)
            assert(buffer[12] === 0xE3)
            assert(buffer[13] === 0x81)
            assert(buffer[14] === 0xAF)
            assert(buffer[15] === 0x20)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 120", () => {
            assert(BinaryRecord.bitLength(record) === 120)
        })

        it("should have byteLength 15", () => {
            assert(BinaryRecord.byteLength(record) === 15)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [\"Hello World!   \"]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                ["Hello World!   "])
        })

        it("should have entries [[a, \"Hello World!   \"]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", "Hello World!   "]])
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
            }) === "'buffer' should have enough size for the offset and size of this record (2 + 15 = 17), but got 16.")
        })
    })

    describe("Record with 1 'shift_jis(15)' field", () => {
        const Record = defineObjectRecord("ShiftJIS15_1", [
            {type: "shift_jis(15)", name: "a"},
        ])
        let buffer = null
        let record = null

        beforeEach(() => {
            buffer = Buffer.from("Hello World!    ")
            record = Record.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..15th bytes", () => {
            assert(record.a === "Hello World!   ")
            assert(buffer[0] === 0x48)
            assert(buffer[1] === 0x65)
            assert(buffer[2] === 0x6C)
            assert(buffer[3] === 0x6C)
            assert(buffer[4] === 0x6F)
            assert(buffer[5] === 0x20)
            assert(buffer[6] === 0x57)
            assert(buffer[7] === 0x6F)
            assert(buffer[8] === 0x72)
            assert(buffer[9] === 0x6C)
            assert(buffer[10] === 0x64)
            assert(buffer[11] === 0x21)
            assert(buffer[12] === 0x20)
            assert(buffer[13] === 0x20)
            assert(buffer[14] === 0x20)
            assert(buffer[15] === 0x20)
        })

        it("should write the 1st..15th bytes", () => {
            record.a = "This is a pen."
            assert(record.a === "This is a pen.")
            assert(buffer[0] === 0x54)
            assert(buffer[1] === 0x68)
            assert(buffer[2] === 0x69)
            assert(buffer[3] === 0x73)
            assert(buffer[4] === 0x20)
            assert(buffer[5] === 0x69)
            assert(buffer[6] === 0x73)
            assert(buffer[7] === 0x20)
            assert(buffer[8] === 0x61)
            assert(buffer[9] === 0x20)
            assert(buffer[10] === 0x70)
            assert(buffer[11] === 0x65)
            assert(buffer[12] === 0x6E)
            assert(buffer[13] === 0x2E)
            assert(buffer[14] === 0x00)
            assert(buffer[15] === 0x20)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 1)
            })

            it("should read the 2nd..16th bytes", () => {
                assert(record.a === "ello World!    ")
                assert(buffer[0] === 0x48)
                assert(buffer[1] === 0x65)
                assert(buffer[2] === 0x6C)
                assert(buffer[3] === 0x6C)
                assert(buffer[4] === 0x6F)
                assert(buffer[5] === 0x20)
                assert(buffer[6] === 0x57)
                assert(buffer[7] === 0x6F)
                assert(buffer[8] === 0x72)
                assert(buffer[9] === 0x6C)
                assert(buffer[10] === 0x64)
                assert(buffer[11] === 0x21)
                assert(buffer[12] === 0x20)
                assert(buffer[13] === 0x20)
                assert(buffer[14] === 0x20)
                assert(buffer[15] === 0x20)
            })

            it("should write the 2nd..16th bytes", () => {
                record.a = "This is a pen."
                assert(record.a === "This is a pen.")
                assert(buffer[0] === 0x48)
                assert(buffer[1] === 0x54)
                assert(buffer[2] === 0x68)
                assert(buffer[3] === 0x69)
                assert(buffer[4] === 0x73)
                assert(buffer[5] === 0x20)
                assert(buffer[6] === 0x69)
                assert(buffer[7] === 0x73)
                assert(buffer[8] === 0x20)
                assert(buffer[9] === 0x61)
                assert(buffer[10] === 0x20)
                assert(buffer[11] === 0x70)
                assert(buffer[12] === 0x65)
                assert(buffer[13] === 0x6E)
                assert(buffer[14] === 0x2E)
                assert(buffer[15] === 0x00)
            })
        })

        //
        // Internationalization
        //

        it("should be possible to address Japanese", () => {
            record.a = "こんにちは"
            assert(record.a === "こんにちは")
            assert(buffer[0] === 0x82)
            assert(buffer[1] === 0xB1)
            assert(buffer[2] === 0x82)
            assert(buffer[3] === 0xF1)
            assert(buffer[4] === 0x82)
            assert(buffer[5] === 0xC9)
            assert(buffer[6] === 0x82)
            assert(buffer[7] === 0xBF)
            assert(buffer[8] === 0x82)
            assert(buffer[9] === 0xCD)
            assert(buffer[10] === 0x00)
            assert(buffer[11] === 0x00)
            assert(buffer[12] === 0x00)
            assert(buffer[13] === 0x00)
            assert(buffer[14] === 0x00)
            assert(buffer[15] === 0x20)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 120", () => {
            assert(BinaryRecord.bitLength(record) === 120)
        })

        it("should have byteLength 15", () => {
            assert(BinaryRecord.byteLength(record) === 15)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [\"Hello World!   \"]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                ["Hello World!   "])
        })

        it("should have entries [[a, \"Hello World!   \"]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", "Hello World!   "]])
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
            }) === "'buffer' should have enough size for the offset and size of this record (2 + 15 = 17), but got 16.")
        })
    })
})
