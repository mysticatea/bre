import assert from "assert"
import {
    RecordOf,
    defineArrayRecord,
    defineObjectRecord,
} from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with record and 2", () => {
        const SubRecord = defineObjectRecord("SubRecord", {
            a: "uint8",
            b: "uint8",
        })
        const TestRecord = defineArrayRecord(SubRecord, 2)
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property", () => {
            assert.strictEqual(record.length, 2)
        })

        it("should read the 1st..4th bytes", () => {
            assert.strictEqual(record[0].a, 1)
            assert.strictEqual(record[0].b, 2)
            assert.strictEqual(record[1].a, 3)
            assert.strictEqual(record[1].b, 4)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record[0].a = 135
            record[0].b = 101
            record[1].a = 67
            record[1].b = 33
            assert.strictEqual(record[0].a, 135)
            assert.strictEqual(record[0].b, 101)
            assert.strictEqual(record[1].a, 67)
            assert.strictEqual(record[1].b, 33)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x43)
            assert.strictEqual(buffer[3], 0x21)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 1", () => {
            beforeEach(() => {
                record = TestRecord.view(buffer, 1)
            })

            it("should have length property", () => {
                assert.strictEqual(record.length, 2)
            })

            it("should read the 2nd..5th bytes", () => {
                assert.strictEqual(record[0].a, 2)
                assert.strictEqual(record[0].b, 3)
                assert.strictEqual(record[1].a, 4)
                assert.strictEqual(record[1].b, 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record[0].a = 135
                record[0].b = 101
                record[1].a = 67
                record[1].b = 33
                assert.strictEqual(record[0].a, 135)
                assert.strictEqual(record[0].b, 101)
                assert.strictEqual(record[1].a, 67)
                assert.strictEqual(record[1].b, 33)
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

        it("should have keys [0,1]", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1])
        })

        it("should have values [{a:1,b:2}, {a:3,b:4}]", () => {
            const actual = Array.from(record.values())
            assert.strictEqual(actual[0].a, 1)
            assert.strictEqual(actual[0].b, 2)
            assert.strictEqual(actual[1].a, 3)
            assert.strictEqual(actual[1].b, 4)
        })

        it("should have entries [[0, {a:1,b:2}], [1, {a:3,b:4}]]", () => {
            const actual = Array.from(record.entries())
            assert.strictEqual(actual[0][0], 0)
            assert.strictEqual(actual[0][1].a, 1)
            assert.strictEqual(actual[0][1].b, 2)
            assert.strictEqual(actual[1][0], 1)
            assert.strictEqual(actual[1][1].a, 3)
            assert.strictEqual(actual[1][1].b, 4)
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
                    TestRecord.view(buffer, 2)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (2 + 4 = 6), but got 5.",
            )
        })
    })
})
