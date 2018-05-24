import assert from "assert"
import { RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'bit7' field", () => {
        const TestRecord = defineObjectRecord("Bit7_1", {
            a: "bit7",
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
            assert.strictEqual(buffer[0], 0x03)
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
                assert.strictEqual(record.a, 2)
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
                assert.strictEqual(buffer[4], 0x03)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 7", () => {
            assert.strictEqual(TestRecord.bitLength, 7)
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

        it("should be ok if it wrote 127", () => {
            record.a = 127
            assert.strictEqual(record.a, 127)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert.strictEqual(record.a, 0)
        })

        it("should throw if it wrote 128 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 128
                }),
                "AssertionError: 'a' should be within '0..127', but got 128.",
            )
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -1
                }),
                "AssertionError: 'a' should be within '0..127', but got -1.",
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

    describe("ObjectRecord with 2 'bit7' fields", () => {
        const TestRecord = defineObjectRecord("Bit7_2", {
            a: "bit7",
            b: "bit7",
        })
        const patterns: ReturnType<(typeof TestRecord)["entries"]> = [
            ["a", 0xfe00],
            ["b", 0x01fc],
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
                    assert.strictEqual(
                        record[key],
                        key === pattern[0] ? 127 : 0,
                    )
                }
            }
        })

        it("should write the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0x0000, 0)
                record[pattern[0]] = 127
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
                            key === pattern[0] ? 127 : 0,
                        )
                    }
                }
            })

            it("should write the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0x0000, 3)
                    record[pattern[0]] = 127
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

        it("should have bitLength 14", () => {
            assert.strictEqual(TestRecord.bitLength, 14)
        })

        it("should have byteLength 2", () => {
            assert.strictEqual(TestRecord.byteLength, 2)
        })

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), "a,b".split(","))
        })
    })
})
