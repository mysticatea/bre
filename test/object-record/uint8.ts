import assert from "assert"
import { RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'uint8' field", () => {
        const TestRecord = defineObjectRecord("UInt8_1", {
            a: "uint8",
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
            assert.strictEqual(record.a, 1)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 135
            assert.strictEqual(record.a, 135)
            assert.strictEqual(buffer[0], 0x87)
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
                assert.strictEqual(record.a, 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 135
                assert.strictEqual(record.a, 135)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x87)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 8", () => {
            assert.strictEqual(TestRecord.bitLength, 8)
        })

        it("should have byteLength 1", () => {
            assert.strictEqual(TestRecord.byteLength, 1)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [1]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [1])
        })

        it("should have entries [[a, 1]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [["a", 1]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 255", () => {
            record.a = 255
            assert.strictEqual(record.a, 255)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert.strictEqual(record.a, 0)
        })

        it("should throw if it wrote 256 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 256
                }),
                "AssertionError: 'a' should be within '0..255', but got 256.",
            )
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -1
                }),
                "AssertionError: 'a' should be within '0..255', but got -1.",
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

    describe("ObjectRecord with 2 'uint8' fields", () => {
        const TestRecord = defineObjectRecord("UInt8_2", {
            a: "uint8",
            b: "uint8",
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

        it("should read the 1st..2nd bytes", () => {
            assert.strictEqual(record.a, 1)
            assert.strictEqual(record.b, 2)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record.a = 135
            record.b = 101
            assert.strictEqual(record.a, 135)
            assert.strictEqual(record.b, 101)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should read the 4th..5th bytes", () => {
                assert.strictEqual(record.a, 4)
                assert.strictEqual(record.b, 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record.a = 135
                record.b = 101
                assert.strictEqual(record.a, 135)
                assert.strictEqual(record.b, 101)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x87)
                assert.strictEqual(buffer[4], 0x65)
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

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [1,2]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [1, 2])
        })

        it("should have entries [[a,1], [b,2]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 1],
                ["b", 2],
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
                    TestRecord.view(buffer, 4)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (4 + 2 = 6), but got 5.",
            )
        })
    })
})
