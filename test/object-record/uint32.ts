import assert from "assert"
import { RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'uint32' field", () => {
        const TestRecord = defineObjectRecord("UInt32_1", {
            a: "uint32",
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

        it("should read the 1st..4th bytes", () => {
            assert.strictEqual(record.a, 16909060)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record.a = 2271560481
            assert.strictEqual(record.a, 2271560481)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x43)
            assert.strictEqual(buffer[3], 0x21)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 1)
            })

            it("should read the 2nd..5th bytes", () => {
                assert.strictEqual(record.a, 33752069)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record.a = 2271560481
                assert.strictEqual(record.a, 2271560481)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x87)
                assert.strictEqual(buffer[2], 0x65)
                assert.strictEqual(buffer[3], 0x43)
                assert.strictEqual(buffer[4], 0x21)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 32", () => {
            assert.strictEqual(TestRecord.bitLength, 32)
        })

        it("should have byteLength 4", () => {
            assert.strictEqual(TestRecord.byteLength, 4)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [16909060]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [16909060])
        })

        it("should have entries [[a, 16909060]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 16909060],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 4294967295", () => {
            record.a = 4294967295
            assert.strictEqual(record.a, 4294967295)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert.strictEqual(record.a, 0)
        })

        it("should throw if it wrote 4294967296 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 4294967296
                }),
                "AssertionError: 'a' should be within '0..4294967295', but got 4294967296.",
            )
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -1
                }),
                "AssertionError: 'a' should be within '0..4294967295', but got -1.",
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
                    TestRecord.view(buffer, 2)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (2 + 4 = 6), but got 5.",
            )
        })
    })
})
