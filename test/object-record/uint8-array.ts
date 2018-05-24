import assert from "assert"
import {
    RecordOf,
    defineArrayRecord,
    defineObjectRecord,
} from "../../src/index"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 uint8[2][3] field", () => {
        const TestRecord = defineObjectRecord("Record", {
            a: defineArrayRecord(defineArrayRecord("uint8", 3), 2),
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05, 0x06])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should have length property as 2", () => {
            assert.strictEqual(record.a.length, 2)
        })

        it(", each element should have length property as 3", () => {
            assert.strictEqual(record.a[0].length, 3)
            assert.strictEqual(record.a[1].length, 3)
        })

        it("should read the 1st..6th bytes", () => {
            assert.strictEqual(record.a[0][0], 1)
            assert.strictEqual(record.a[0][1], 2)
            assert.strictEqual(record.a[0][2], 3)
            assert.strictEqual(record.a[1][0], 4)
            assert.strictEqual(record.a[1][1], 5)
            assert.strictEqual(record.a[1][2], 6)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
            assert.strictEqual(buffer[5], 0x06)
        })

        it("should write the 1st..6th bytes", () => {
            record.a[0][0] = 11
            record.a[0][1] = 12
            record.a[0][2] = 13
            record.a[1][0] = 14
            record.a[1][1] = 15
            record.a[1][2] = 16
            assert.strictEqual(record.a[0][0], 11)
            assert.strictEqual(record.a[0][1], 12)
            assert.strictEqual(record.a[0][2], 13)
            assert.strictEqual(record.a[1][0], 14)
            assert.strictEqual(record.a[1][1], 15)
            assert.strictEqual(record.a[1][2], 16)
            assert.strictEqual(buffer[0], 0x0b)
            assert.strictEqual(buffer[1], 0x0c)
            assert.strictEqual(buffer[2], 0x0d)
            assert.strictEqual(buffer[3], 0x0e)
            assert.strictEqual(buffer[4], 0x0f)
            assert.strictEqual(buffer[5], 0x10)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 48", () => {
            assert.strictEqual(TestRecord.bitLength, 48)
        })

        it("should have byteLength 6", () => {
            assert.strictEqual(TestRecord.byteLength, 6)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [[[1,2,3], [4,5,6]]]", () => {
            const actual = TestRecord.values(record)
            assert.strictEqual(actual[0][0][0], 1)
            assert.strictEqual(actual[0][0][1], 2)
            assert.strictEqual(actual[0][0][2], 3)
            assert.strictEqual(actual[0][1][0], 4)
            assert.strictEqual(actual[0][1][1], 5)
            assert.strictEqual(actual[0][1][2], 6)
        })

        it("should have entries [[a, [[1,2,3], [4,5,6]]]]", () => {
            const actual = TestRecord.entries(record)
            assert.strictEqual(actual[0][0], "a")
            assert.strictEqual(actual[0][1][0][0], 1)
            assert.strictEqual(actual[0][1][0][1], 2)
            assert.strictEqual(actual[0][1][0][2], 3)
            assert.strictEqual(actual[0][1][1][0], 4)
            assert.strictEqual(actual[0][1][1][1], 5)
            assert.strictEqual(actual[0][1][1][2], 6)
        })
    })
})
