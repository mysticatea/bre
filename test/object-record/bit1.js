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
    describe("Record with 1 'bit1' field", () => {
        const Record = defineObjectRecord("Bit1_1", [
            {type: "bit1", name: "a"},
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
            assert(record.a === 0)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            assert(record.a === 1)
            assert(buffer[0] === 0x81)
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
                assert(record.a === 0)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                assert(record.a === 1)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x85)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 1", () => {
            assert(BinaryRecord.bitLength(record) === 1)
        })

        it("should have byteLength 1", () => {
            assert(BinaryRecord.byteLength(record) === 1)
        })

        it("should have keys [a]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a"])
        })

        it("should have values [0]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [0])
        })

        it("should have entries [[a,0]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 0]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 1", () => {
            record.a = 1
            assert(record.a === 1)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert(record.a === 0)
        })

        it("should throw if it wrote 2 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = 2
            }) === "'a' should be within '0..1', but got 2.")
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = -1
            }) === "'a' should be within '0..1', but got -1.")
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
    })

    describe("Record with 2 'bit1' fields", () => {
        const Record = defineObjectRecord("Bit1_2", [
            {type: "bit1", name: "a"},
            {type: "bit1", name: "b"},
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
            assert(record.a === 0)
            assert(record.b === 0)
            assert(buffer[0] === 0x01)
            assert(buffer[1] === 0x02)
            assert(buffer[2] === 0x03)
            assert(buffer[3] === 0x04)
            assert(buffer[4] === 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            record.b = 1
            assert(record.a === 1)
            assert(record.b === 1)
            assert(buffer[0] === 0xC1)
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
                assert(record.a === 0)
                assert(record.b === 0)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                record.b = 1
                assert(record.a === 1)
                assert(record.b === 1)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0xC5)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 2", () => {
            assert(BinaryRecord.bitLength(record) === 2)
        })

        it("should have byteLength 1", () => {
            assert(BinaryRecord.byteLength(record) === 1)
        })

        it("should have keys [a,b]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                ["a", "b"])
        })

        it("should have values [0,0]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.values(record)),
                [0, 0])
        })

        it("should have entries [[a,0], [b,0]]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.entries(record)),
                [["a", 0], ["b", 0]])
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
                Record.view(buffer, 5)
            }) === "'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.")
        })
    })

    describe("Record with 16 'bit1' fields", () => {
        const Record = defineObjectRecord("Bit1_16", [
            {type: "bit1", name: "a"},
            {type: "bit1", name: "b"},
            {type: "bit1", name: "c"},
            {type: "bit1", name: "d"},
            {type: "bit1", name: "e"},
            {type: "bit1", name: "f"},
            {type: "bit1", name: "g"},
            {type: "bit1", name: "h"},
            {type: "bit1", name: "i"},
            {type: "bit1", name: "j"},
            {type: "bit1", name: "k"},
            {type: "bit1", name: "l"},
            {type: "bit1", name: "m"},
            {type: "bit1", name: "n"},
            {type: "bit1", name: "o"},
            {type: "bit1", name: "p"},
        ])
        const patterns = [
            ["a", 0x8000],
            ["b", 0x4000],
            ["c", 0x2000],
            ["d", 0x1000],
            ["e", 0x0800],
            ["f", 0x0400],
            ["g", 0x0200],
            ["h", 0x0100],
            ["i", 0x0080],
            ["j", 0x0040],
            ["k", 0x0020],
            ["l", 0x0010],
            ["m", 0x0008],
            ["n", 0x0004],
            ["o", 0x0002],
            ["p", 0x0001],
        ]
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
            for (const pattern of patterns) {
                buffer.writeUInt16BE(pattern[1], 0)

                for (const key of BinaryRecord.keys(record)) {
                    assert(record[key] === (key === pattern[0] ? 1 : 0))
                }
            }
        })

        it("should write the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0x0000, 0)
                record[pattern[0]] = 1
                assert(buffer.readUInt16BE(0) === pattern[1])
            }
        })

        it("should write the 1st..2nd bytes (invert)", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0xFFFF, 0)
                record[pattern[0]] = 0
                assert(buffer.readUInt16BE(0) === (~pattern[1] & 0xFFFF))
            }
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = Record.view(buffer, 3)
            })

            it("should read the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(pattern[1], 3)

                    for (const key of BinaryRecord.keys(record)) {
                        assert(record[key] === (key === pattern[0] ? 1 : 0))
                    }
                }
            })

            it("should write the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0x0000, 3)
                    record[pattern[0]] = 1
                    assert(buffer.readUInt16BE(3) === pattern[1])
                }
            })

            it("should write the 4th..5th bytes (invert)", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0xFFFF, 3)
                    record[pattern[0]] = 0
                    assert(buffer.readUInt16BE(3) === (~pattern[1] & 0xFFFF))
                }
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

        it("should have keys [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p".split(","))
        })
    })
})
