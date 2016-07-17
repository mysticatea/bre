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
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord:", () => {
    describe("Record with 1 'int8' field", () => {
        const Record = defineObjectRecord("Int8_1", [
            {type: "int8", name: "a"},
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

        it("should read the 1st byte", () => {
            assert(record.a === 1)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = -121
            assert(record.a === -121)
            assert(buffer[0] === 0x87)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        describe("with offset 4", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 4)
            })

            it("should read the 5th byte", () => {
                assert(record.a === 5)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = -121
                assert(record.a === -121)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x87)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 8", () => {
            assert(BinaryRecord.bitLength(record) === 8)
        })

        it("should have byteLength 1", () => {
            assert(BinaryRecord.byteLength(record) === 1)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [1]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [1])
        })

        it("should have entries [[a, 1]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 1]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 127", () => {
            record.a = 127
            assert(record.a === 127)
        })

        it("should be ok if it wrote -128", () => {
            record.a = -128
            assert(record.a === -128)
        })

        it("should throw if it wrote 128 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = 128
            }) === "'a' should be within '-128..127', but got 128.")
        })

        it("should throw if it wrote -129 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = -129
            }) === "'a' should be within '-128..127', but got -129.")
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, -1)
            }) === "'byteOffset' should be '>=0', but got -1.")
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert(thrownMessage(() => {
                Record.view(buffer, 5)
            }) === "'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.")
        })

        //
        // Error messages
        //

        it("should throw if it wrote a non-integer (null)", () => {
            assert(thrownMessage(() => {
                record.a = null
            }) === "'a' should be an integer, but got null.")
        })

        it("should throw if it wrote a non-integer (string)", () => {
            assert(thrownMessage(() => {
                record.a = "a"
            }) === "'a' should be an integer, but got a string.")
        })

        it("should throw if it wrote a non-integer (double)", () => {
            assert(thrownMessage(() => {
                record.a = 0.5
            }) === "'a' should be an integer, but got a number.")
        })

        it("should throw if it wrote a non-integer (object)", () => {
            assert(thrownMessage(() => {
                record.a = {}
            }) === "'a' should be an integer, but got an object.")
        })

        it("should throw if it wrote a non-integer (array)", () => {
            assert(thrownMessage(() => {
                record.a = []
            }) === "'a' should be an integer, but got an Array object.")
        })

        it("should throw if it wrote a non-integer (function)", () => {
            assert(thrownMessage(() => {
                record.a = function foo() {
                    // do nothing.
                }
            }) === "'a' should be an integer, but got function \"foo\".")
        })

        it("should throw if it wrote a non-integer (anonymous function)", () => {
            assert(thrownMessage(() => {
                record.a = () => {
                    // do nothing.
                }
            }) === "'a' should be an integer, but got an anonymous function.")
        })
    })

    describe("Record with 2 'int8' fields", () => {
        const Record = defineObjectRecord("Int8_2", [
            {type: "int8", name: "a"},
            {type: "int8", name: "b"},
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

        it("should read the 1st..2nd bytes", () => {
            assert(record.a === 1)
            assert(record.b === 2)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record.a = -121
            record.b = 101
            assert(record.a === -121)
            assert(record.b === 101)
            assert(buffer[0] === 0x87)
            assert(buffer[1] === 0x65)
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

            it("should read the 4th..5th bytes", () => {
                assert(record.a === 4)
                assert(record.b === 5)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record.a = -121
                record.b = 101
                assert(record.a === -121)
                assert(record.b === 101)
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

        it("should have bitLength 16", () => {
            assert(BinaryRecord.bitLength(record) === 16)
        })

        it("should have byteLength 2", () => {
            assert(BinaryRecord.byteLength(record) === 2)
        })

        it("should have keys [a,b]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a", "b"])
        })

        it("should have values [1,2]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [1, 2])
        })

        it("should have entries [[a,1], [b,2]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 1], ["b", 2]])
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
                Record.view(buffer, 4)
            }) === "'buffer' should have enough size for the offset and size of this record (4 + 2 = 6), but got 5.")
        })
    })
})
