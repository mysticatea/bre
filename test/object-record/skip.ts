import assert from "assert"
import { ObjectRecord, RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 2 'uint8' fields and skip", () => {
        const TestRecord = defineObjectRecord("Skip", {
            a: { type: "uint8" },
            b: { type: "uint8", bitOffset: 16 },
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st and 3rd bytes", () => {
            assert.strictEqual(record.a, 1)
            assert.strictEqual(record.b, 3)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
        })

        it("should write the 1st and 3rd bytes", () => {
            record.a = 16
            record.b = 32
            assert.strictEqual(record.a, 16)
            assert.strictEqual(record.b, 32)
            assert.strictEqual(buffer[0], 0x10)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x20)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 24", () => {
            assert.strictEqual(TestRecord.bitLength, 24)
        })

        it("should have byteLength 3", () => {
            assert.strictEqual(TestRecord.byteLength, 3)
        })

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [1,3]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [1, 3])
        })

        it("should have entries [[a, 1], [b, 3]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 1],
                ["b", 3],
            ])
        })
    })

    describe("ObjectRecord with 2 'uint8' fields and skip and specify size", () => {
        const TestRecord = defineObjectRecord(
            "Skip",
            {
                a: { type: "uint8" },
                b: { type: "uint8", bitOffset: 16 },
            },
            { bitLength: 32 },
        )
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st and 3rd bytes", () => {
            assert.strictEqual(record.a, 1)
            assert.strictEqual(record.b, 3)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
        })

        it("should write the 1st and 3rd bytes", () => {
            record.a = 16
            record.b = 32
            assert.strictEqual(record.a, 16)
            assert.strictEqual(record.b, 32)
            assert.strictEqual(buffer[0], 0x10)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x20)
            assert.strictEqual(buffer[3], 0x04)
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

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [1,3]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [1, 3])
        })

        it("should have entries [[a, 1], [b, 3]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 1],
                ["b", 3],
            ])
        })
    })
})
