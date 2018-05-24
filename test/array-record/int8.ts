import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'int8' and 4", () => {
        const TestRecord = defineArrayRecord("int8", 4)
        let buffer: Buffer
        let record: ArrayRecord<number>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property", () => {
            assert.strictEqual(record.length, 4)
        })

        it("should read the 1st..4th bytes", () => {
            assert.strictEqual(record[0], 1)
            assert.strictEqual(record[1], 2)
            assert.strictEqual(record[2], 3)
            assert.strictEqual(record[3], 4)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record[0] = -121
            record[1] = 101
            record[2] = 67
            record[3] = 33
            assert.strictEqual(record[0], -121)
            assert.strictEqual(record[1], 101)
            assert.strictEqual(record[2], 67)
            assert.strictEqual(record[3], 33)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x43)
            assert.strictEqual(buffer[3], 0x21)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = TestRecord.view(buffer, 1)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 4)
            })

            it("should read the 2nd..5th bytes", () => {
                assert.strictEqual(record[0], 2)
                assert.strictEqual(record[1], 3)
                assert.strictEqual(record[2], 4)
                assert.strictEqual(record[3], 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0] = -121
                record[1] = 101
                record[2] = 67
                record[3] = 33
                assert.strictEqual(record[0], -121)
                assert.strictEqual(record[1], 101)
                assert.strictEqual(record[2], 67)
                assert.strictEqual(record[3], 33)
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

        it("should have keys [0,1,2,3]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1, 2, 3])
        })

        it("should have values [1,2,3,4]", () => {
            assert.deepStrictEqual(Array.from(record.values()), [1, 2, 3, 4])
        })

        it("should have entries [[0,1],[1,2],[2,3],[3,4]]", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 4],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 127", () => {
            for (const k of record.keys()) {
                record[k] = 127
                assert.strictEqual(record[k], 127)
            }
        })

        it("should be ok if it wrote -128", () => {
            for (const k of record.keys()) {
                record[k] = -128
                assert.strictEqual(record[k], -128)
            }
        })

        it("should throw if it wrote 128 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = 128
                    }),
                    `AssertionError: '${k}' should be within '-128..127', but got 128.`,
                )
            }
        })

        it("should throw if it wrote -129 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = -129
                    }),
                    `AssertionError: '${k}' should be within '-128..127', but got -129.`,
                )
            }
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
