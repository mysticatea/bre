import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'bit1' and 10", () => {
        const TestRecord = defineArrayRecord("bit1", 10)
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
            assert.strictEqual(record.length, 10)
        })

        it("should read the 1st..2nd bytes", () => {
            assert.strictEqual(record[0], 0)
            assert.strictEqual(record[1], 0)
            assert.strictEqual(record[2], 0)
            assert.strictEqual(record[3], 0)
            assert.strictEqual(record[4], 0)
            assert.strictEqual(record[5], 0)
            assert.strictEqual(record[6], 0)
            assert.strictEqual(record[7], 1)
            assert.strictEqual(record[8], 0)
            assert.strictEqual(record[9], 0)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record[0] = 1
            record[1] = 0
            record[2] = 0
            record[3] = 0
            record[4] = 0
            record[5] = 1
            record[6] = 1
            record[7] = 1
            record[8] = 0
            record[9] = 1
            assert.strictEqual(record[0], 1)
            assert.strictEqual(record[1], 0)
            assert.strictEqual(record[2], 0)
            assert.strictEqual(record[3], 0)
            assert.strictEqual(record[4], 0)
            assert.strictEqual(record[5], 1)
            assert.strictEqual(record[6], 1)
            assert.strictEqual(record[7], 1)
            assert.strictEqual(record[8], 0)
            assert.strictEqual(record[9], 1)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x42)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 3", () => {
            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 10)
            })

            it("should read the 4th..5th bytes", () => {
                assert.strictEqual(record[0], 0)
                assert.strictEqual(record[1], 0)
                assert.strictEqual(record[2], 0)
                assert.strictEqual(record[3], 0)
                assert.strictEqual(record[4], 0)
                assert.strictEqual(record[5], 1)
                assert.strictEqual(record[6], 0)
                assert.strictEqual(record[7], 0)
                assert.strictEqual(record[8], 0)
                assert.strictEqual(record[9], 0)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record[0] = 1
                record[1] = 0
                record[2] = 0
                record[3] = 0
                record[4] = 0
                record[5] = 1
                record[6] = 1
                record[7] = 1
                record[8] = 0
                record[9] = 1
                assert.strictEqual(record[0], 1)
                assert.strictEqual(record[1], 0)
                assert.strictEqual(record[2], 0)
                assert.strictEqual(record[3], 0)
                assert.strictEqual(record[4], 0)
                assert.strictEqual(record[5], 1)
                assert.strictEqual(record[6], 1)
                assert.strictEqual(record[7], 1)
                assert.strictEqual(record[8], 0)
                assert.strictEqual(record[9], 1)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x87)
                assert.strictEqual(buffer[4], 0x45)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 10", () => {
            assert.strictEqual(TestRecord.bitLength, 10)
        })

        it("should have byteLength 2", () => {
            assert.strictEqual(TestRecord.byteLength, 2)
        })

        it("should have keys [0,1,2,3,4,5,6,7,8,9]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
            ])
        })

        it("should have values [0,0,0,0,0,0,0,1,0,0]", () => {
            assert.deepStrictEqual(Array.from(record.values()), [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
            ])
        })

        it("should have entries [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,1],[8,0],[9,0]]", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0],
                [7, 1],
                [8, 0],
                [9, 0],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 1", () => {
            for (const k of record.keys()) {
                record[k] = 1
                assert.strictEqual(record[k], 1)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert.strictEqual(record[k], 0)
            }
        })

        it("should throw if it wrote 2 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = 2
                    }),
                    `AssertionError: '${k}' should be within '0..1', but got 2.`,
                )
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = -1
                    }),
                    `AssertionError: '${k}' should be within '0..1', but got -1.`,
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
