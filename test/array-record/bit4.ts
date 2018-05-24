import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'bit4' and 4", () => {
        const TestRecord = defineArrayRecord("bit4", 4)
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

        it("should read the 1st..2nd bytes", () => {
            assert.strictEqual(record[0], 0)
            assert.strictEqual(record[1], 1)
            assert.strictEqual(record[2], 0)
            assert.strictEqual(record[3], 2)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record[0] = 8
            record[1] = 7
            record[2] = 6
            record[3] = 5
            assert.strictEqual(record[0], 8)
            assert.strictEqual(record[1], 7)
            assert.strictEqual(record[2], 6)
            assert.strictEqual(record[3], 5)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 3", () => {
            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 4)
            })

            it("should read the 4th..5th bytes", () => {
                assert.strictEqual(record[0], 0)
                assert.strictEqual(record[1], 4)
                assert.strictEqual(record[2], 0)
                assert.strictEqual(record[3], 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record[0] = 8
                record[1] = 7
                record[2] = 6
                record[3] = 5
                assert.strictEqual(record[0], 8)
                assert.strictEqual(record[1], 7)
                assert.strictEqual(record[2], 6)
                assert.strictEqual(record[3], 5)
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

        it("should have keys [0,1,2,3]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1, 2, 3])
        })

        it("should have values [0,1,0,2]", () => {
            assert.deepStrictEqual(Array.from(record.values()), [0, 1, 0, 2])
        })

        it("should have entries [[0,0],[1,1],[2,0],[3,2]]", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 0],
                [1, 1],
                [2, 0],
                [3, 2],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 15", () => {
            for (const k of record.keys()) {
                record[k] = 15
                assert.strictEqual(record[k], 15)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert.strictEqual(record[k], 0)
            }
        })

        it("should throw if it wrote 16 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = 16
                    }),
                    `AssertionError: '${k}' should be within '0..15', but got 16.`,
                )
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = -1
                    }),
                    `AssertionError: '${k}' should be within '0..15', but got -1.`,
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
                    TestRecord.view(buffer, 4)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (4 + 2 = 6), but got 5.",
            )
        })
    })
})
