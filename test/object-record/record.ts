import assert from "assert"
import { RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 2 sub-record fields", () => {
        const SubRecord = defineObjectRecord("SubRecord", {
            a: "uint8",
            b: "uint8",
        })
        const TestRecord = defineObjectRecord("Record", {
            a: SubRecord,
            b: SubRecord,
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
            assert.strictEqual(record.a.a, 1)
            assert.strictEqual(record.a.b, 2)
            assert.strictEqual(record.b.a, 3)
            assert.strictEqual(record.b.b, 4)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record.a.a = 135
            record.a.b = 101
            record.b.a = 67
            record.b.b = 33
            assert.strictEqual(record.a.a, 135)
            assert.strictEqual(record.a.b, 101)
            assert.strictEqual(record.b.a, 67)
            assert.strictEqual(record.b.b, 33)
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
                assert.strictEqual(record.a.a, 2)
                assert.strictEqual(record.a.b, 3)
                assert.strictEqual(record.b.a, 4)
                assert.strictEqual(record.b.b, 5)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record.a.a = 135
                record.a.b = 101
                record.b.a = 67
                record.b.b = 33
                assert.strictEqual(record.a.a, 135)
                assert.strictEqual(record.a.b, 101)
                assert.strictEqual(record.b.a, 67)
                assert.strictEqual(record.b.b, 33)
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

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [{a:1,b:2}, {a:3,b:4}]", () => {
            const actual = TestRecord.values(record)
            assert.strictEqual(actual[0].a, 1)
            assert.strictEqual(actual[0].b, 2)
            assert.strictEqual(actual[1].a, 3)
            assert.strictEqual(actual[1].b, 4)
        })

        it("should have entries [[a, {a:1,b:2}], [b, {a:3,b:4}]]", () => {
            const actual = TestRecord.entries(record)
            assert.strictEqual(actual[0][0], "a")
            assert.strictEqual(actual[0][1].a, 1)
            assert.strictEqual(actual[0][1].b, 2)
            assert.strictEqual(actual[1][0], "b")
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
