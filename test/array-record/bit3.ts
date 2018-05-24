import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'bit3' and 5", () => {
        const TestRecord = defineArrayRecord("bit3", 5)
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
            assert.strictEqual(record.length, 5)
        })

        it("should read the 1st..2nd bytes", () => {
            assert.strictEqual(record[0], 0)
            assert.strictEqual(record[1], 0)
            assert.strictEqual(record[2], 2)
            assert.strictEqual(record[3], 0)
            assert.strictEqual(record[4], 1)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..2nd bytes", () => {
            record[0] = 4
            record[1] = 1
            record[2] = 6
            record[3] = 6
            record[4] = 2
            assert.strictEqual(record[0], 4)
            assert.strictEqual(record[1], 1)
            assert.strictEqual(record[2], 6)
            assert.strictEqual(record[3], 6)
            assert.strictEqual(record[4], 2)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x64)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 5)
            })

            it("should read the 4th..5th bytes", () => {
                assert.strictEqual(record[0], 0)
                assert.strictEqual(record[1], 1)
                assert.strictEqual(record[2], 0)
                assert.strictEqual(record[3], 0)
                assert.strictEqual(record[4], 2)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 4th..5th bytes", () => {
                record[0] = 4
                record[1] = 1
                record[2] = 6
                record[3] = 6
                record[4] = 2
                assert.strictEqual(record[0], 4)
                assert.strictEqual(record[1], 1)
                assert.strictEqual(record[2], 6)
                assert.strictEqual(record[3], 6)
                assert.strictEqual(record[4], 2)
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

        it("should have bitLength 15", () => {
            assert.strictEqual(TestRecord.bitLength, 15)
        })

        it("should have byteLength 2", () => {
            assert.strictEqual(TestRecord.byteLength, 2)
        })

        it("should have keys [0,1,2,3,4]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1, 2, 3, 4])
        })

        it("should have values [0,0,2,0,1]", () => {
            assert.deepStrictEqual(Array.from(record.values()), [0, 0, 2, 0, 1])
        })

        it("should have entries [[0,0],[1,0],[2,2],[3,0],[4,1]]", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 0],
                [1, 0],
                [2, 2],
                [3, 0],
                [4, 1],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 7", () => {
            for (const k of record.keys()) {
                record[k] = 7
                assert.strictEqual(record[k], 7)
            }
        })

        it("should be ok if it wrote 0", () => {
            for (const k of record.keys()) {
                record[k] = 0
                assert.strictEqual(record[k], 0)
            }
        })

        it("should throw if it wrote 8 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = 8
                    }),
                    `AssertionError: '${k}' should be within '0..7', but got 8.`,
                )
            }
        })

        it("should throw if it wrote -1 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = -1
                    }),
                    `AssertionError: '${k}' should be within '0..7', but got -1.`,
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
