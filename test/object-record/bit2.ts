import assert from "assert"
import { ObjectRecord, RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'bit2' field", () => {
        const TestRecord = defineObjectRecord("Bit2_1", {
            a: "bit2",
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st byte", () => {
            assert.strictEqual(record.a, 0)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            assert.strictEqual(record.a, 1)
            assert.strictEqual(buffer[0], 0x41)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 4", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 4)
            })

            it("should read the 5th byte", () => {
                assert.strictEqual(record.a, 0)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                assert.strictEqual(record.a, 1)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x45)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 2", () => {
            assert.strictEqual(TestRecord.bitLength, 2)
        })

        it("should have byteLength 1", () => {
            assert.strictEqual(TestRecord.byteLength, 1)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [0]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [0])
        })

        it("should have entries [[a,0]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [["a", 0]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 3", () => {
            record.a = 3
            assert.strictEqual(record.a, 3)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert.strictEqual(record.a, 0)
        })

        it("should throw if it wrote 4 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 4
                }),
                "AssertionError: 'a' should be within '0..3', but got 4.",
            )
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -1
                }),
                "AssertionError: 'a' should be within '0..3', but got -1.",
            )
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    TestRecord.view(buffer, -1)
                }),
                "AssertionError: 'byteOffset' should be '>=0', but got -1.",
            )
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    TestRecord.view(buffer, 5)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.",
            )
        })
    })

    describe("ObjectRecord with 2 'bit2' fields", () => {
        const TestRecord = defineObjectRecord("Bit2_2", {
            a: "bit2",
            b: "bit2",
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st byte", () => {
            assert.strictEqual(record.a, 0)
            assert.strictEqual(record.b, 0)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            record.b = 2
            assert.strictEqual(record.a, 1)
            assert.strictEqual(record.b, 2)
            assert.strictEqual(buffer[0], 0x61)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 4", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 4)
            })

            it("should read the 5th byte", () => {
                assert.strictEqual(record.a, 0)
                assert.strictEqual(record.b, 0)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                record.b = 2
                assert.strictEqual(record.a, 1)
                assert.strictEqual(record.b, 2)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x65)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 4", () => {
            assert.strictEqual(TestRecord.bitLength, 4)
        })

        it("should have byteLength 1", () => {
            assert.strictEqual(TestRecord.byteLength, 1)
        })

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [0,0]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [0, 0])
        })

        it("should have entries [[a,0], [b,0]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 0],
                ["b", 0],
            ])
        })

        //
        // Boundary Check
        //

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    TestRecord.view(buffer, -1)
                }),
                "AssertionError: 'byteOffset' should be '>=0', but got -1.",
            )
        })

        it("should throw if it creates a Record with an invalid offset (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    TestRecord.view(buffer, 5)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.",
            )
        })
    })

    describe("ObjectRecord with 8 'bit2' fields", () => {
        const TestRecord = defineObjectRecord("Bit2_8", {
            a: "bit2",
            b: "bit2",
            c: "bit2",
            d: "bit2",
            e: "bit2",
            f: "bit2",
            g: "bit2",
            h: "bit2",
        })
        const patterns: Array<[string, number]> = [
            ["a", 0xc000],
            ["b", 0x3000],
            ["c", 0x0c00],
            ["d", 0x0300],
            ["e", 0x00c0],
            ["f", 0x0030],
            ["g", 0x000c],
            ["h", 0x0003],
        ]
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(pattern[1], 0)

                for (const key of TestRecord.keys(record)) {
                    assert.strictEqual(record[key], key === pattern[0] ? 3 : 0)
                }
            }
        })

        it("should write the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0x0000, 0)
                record[pattern[0]] = 3
                assert.strictEqual(buffer.readUInt16BE(0), pattern[1])
            }
        })

        it("should write the 1st..2nd bytes (invert)", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0xffff, 0)
                record[pattern[0]] = 0
                assert.strictEqual(buffer.readUInt16BE(0), ~pattern[1] & 0xffff)
            }
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should read the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(pattern[1], 3)

                    for (const key of TestRecord.keys(record)) {
                        assert.strictEqual(
                            record[key],
                            key === pattern[0] ? 3 : 0,
                        )
                    }
                }
            })

            it("should write the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0x0000, 3)
                    record[pattern[0]] = 3
                    assert.strictEqual(buffer.readUInt16BE(3), pattern[1])
                }
            })

            it("should write the 4th..5th bytes (invert)", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0xffff, 3)
                    record[pattern[0]] = 0
                    assert.strictEqual(
                        buffer.readUInt16BE(3),
                        ~pattern[1] & 0xffff,
                    )
                }
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 16", () => {
            assert.strictEqual(TestRecord.bitLength, 16)
        })

        it("should have byteLength 2", () => {
            assert.strictEqual(TestRecord.byteLength, 2)
        })

        it("should have keys [a,b,c,d,e,f,g,h]", () => {
            assert.deepStrictEqual(
                TestRecord.keys(record),
                "a,b,c,d,e,f,g,h".split(","),
            )
        })
    })
})
