import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'int32' and 2", () => {
        const TestRecord = defineArrayRecord("int32", 2)
        let buffer: Buffer
        let record: ArrayRecord<number>

        beforeEach(() => {
            buffer = Buffer.from([
                0x01,
                0x02,
                0x03,
                0x04,
                0x05,
                0x06,
                0x07,
                0x08,
                0x09,
            ])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property", () => {
            assert.strictEqual(record.length, 2)
        })

        it("should read the 1st..8th bytes", () => {
            assert.strictEqual(record[0], 16909060)
            assert.strictEqual(record[1], 84281096)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
            assert.strictEqual(buffer[5], 0x06)
            assert.strictEqual(buffer[6], 0x07)
            assert.strictEqual(buffer[7], 0x08)
            assert.strictEqual(buffer[8], 0x09)
        })

        it("should write the 1st..4th bytes", () => {
            record[0] = -19088744
            record[1] = 1985229328
            assert.strictEqual(record[0], -19088744)
            assert.strictEqual(record[1], 1985229328)
            assert.strictEqual(buffer[0], 0xfe)
            assert.strictEqual(buffer[1], 0xdc)
            assert.strictEqual(buffer[2], 0xba)
            assert.strictEqual(buffer[3], 0x98)
            assert.strictEqual(buffer[4], 0x76)
            assert.strictEqual(buffer[5], 0x54)
            assert.strictEqual(buffer[6], 0x32)
            assert.strictEqual(buffer[7], 0x10)
            assert.strictEqual(buffer[8], 0x09)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record = null

            beforeEach(() => {
                record = TestRecord.view(buffer, 1)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 2)
            })

            it("should read the 2nd..5th bytes", () => {
                assert.strictEqual(record[0], 33752069)
                assert.strictEqual(record[1], 101124105)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
                assert.strictEqual(buffer[5], 0x06)
                assert.strictEqual(buffer[6], 0x07)
                assert.strictEqual(buffer[7], 0x08)
                assert.strictEqual(buffer[8], 0x09)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0] = -19088744
                record[1] = 1985229328
                assert.strictEqual(record[0], -19088744)
                assert.strictEqual(record[1], 1985229328)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0xfe)
                assert.strictEqual(buffer[2], 0xdc)
                assert.strictEqual(buffer[3], 0xba)
                assert.strictEqual(buffer[4], 0x98)
                assert.strictEqual(buffer[5], 0x76)
                assert.strictEqual(buffer[6], 0x54)
                assert.strictEqual(buffer[7], 0x32)
                assert.strictEqual(buffer[8], 0x10)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 64", () => {
            assert.strictEqual(TestRecord.bitLength, 64)
        })

        it("should have byteLength 4", () => {
            assert.strictEqual(TestRecord.byteLength, 8)
        })

        it("should have keys [0,1]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1])
        })

        it("should have values [16909060,84281096]", () => {
            assert.deepStrictEqual(Array.from(record.values()), [
                16909060,
                84281096,
            ])
        })

        it("should have entries [[0,16909060],[1,84281096]]", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 16909060],
                [1, 84281096],
            ])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 2147483647", () => {
            for (const k of record.keys()) {
                record[k] = 2147483647
                assert.strictEqual(record[k], 2147483647)
            }
        })

        it("should be ok if it wrote -2147483648", () => {
            for (const k of record.keys()) {
                record[k] = -2147483648
                assert.strictEqual(record[k], -2147483648)
            }
        })

        it("should throw if it wrote 2147483648 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = 2147483648
                    }),
                    `AssertionError: '${k}' should be within '-2147483648..2147483647', but got 2147483648.`,
                )
            }
        })

        it("should throw if it wrote -2147483649 (out of range)", () => {
            for (const k of record.keys()) {
                assert.strictEqual(
                    thrownMessage(() => {
                        record[k] = -2147483649
                    }),
                    `AssertionError: '${k}' should be within '-2147483648..2147483647', but got -2147483649.`,
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
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (2 + 8 = 10), but got 9.",
            )
        })
    })
})
