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
    describe("Record with 1 'bit2' field", () => {
        const Record = defineObjectRecord("Bit2_1", [
            {type: "bit2", name: "a"},
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
            assert(buffer[0] === 0x41)
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
                assert(buffer[4] === 0x45)
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

        it("should be ok if it wrote 3", () => {
            record.a = 3
            assert(record.a === 3)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert(record.a === 0)
        })

        it("should throw if it wrote 4 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = 4
            }) === "'a' should be within '0..3', but got 4.")
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert(thrownMessage(() => {
                record.a = -1
            }) === "'a' should be within '0..3', but got -1.")
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

    describe("Record with 2 'bit2' fields", () => {
        const Record = defineObjectRecord("Bit2_2", [
            {type: "bit2", name: "a"},
            {type: "bit2", name: "b"},
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
            record.b = 2
            assert(record.a === 1)
            assert(record.b === 2)
            assert(buffer[0] === 0x61)
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
                record.b = 2
                assert(record.a === 1)
                assert(record.b === 2)
                assert(buffer[0] === 0x01)
                assert(buffer[1] === 0x02)
                assert(buffer[2] === 0x03)
                assert(buffer[3] === 0x04)
                assert(buffer[4] === 0x65)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 4", () => {
            assert(BinaryRecord.bitLength(record) === 4)
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

    describe("Record with 8 'bit2' fields", () => {
        const Record = defineObjectRecord("Bit2_8", [
            {type: "bit2", name: "a"},
            {type: "bit2", name: "b"},
            {type: "bit2", name: "c"},
            {type: "bit2", name: "d"},
            {type: "bit2", name: "e"},
            {type: "bit2", name: "f"},
            {type: "bit2", name: "g"},
            {type: "bit2", name: "h"},
        ])
        const patterns = [
            ["a", 0xC000],
            ["b", 0x3000],
            ["c", 0x0C00],
            ["d", 0x0300],
            ["e", 0x00C0],
            ["f", 0x0030],
            ["g", 0x000C],
            ["h", 0x0003],
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
                    assert(record[key] === (key === pattern[0] ? 3 : 0))
                }
            }
        })

        it("should write the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0x0000, 0)
                record[pattern[0]] = 3
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
                        assert(record[key] === (key === pattern[0] ? 3 : 0))
                    }
                }
            })

            it("should write the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0x0000, 3)
                    record[pattern[0]] = 3
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

        it("should have keys [a,b,c,d,e,f,g,h]", () => {
            assert.deepEqual(
                Array.from(BinaryRecord.keys(record)),
                "a,b,c,d,e,f,g,h".split(","))
        })
    })
})
