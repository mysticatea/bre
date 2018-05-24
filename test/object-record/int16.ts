import assert from "assert"
import { RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'int16' field", () => {
        const TestRecord = defineObjectRecord("Int16_1", {
            a: "int16",
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

        it("should read the 1st byte", () => {
            assert.strictEqual(record.a, 258)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = -30875
            assert.strictEqual(record.a, -30875)
            assert.strictEqual(buffer[0], 0x87)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should read the 5th byte", () => {
                assert.strictEqual(record.a, 1029)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = -30875
                assert.strictEqual(record.a, -30875)
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

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [258]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [258])
        })

        it("should have entries [[a, 258]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [["a", 258]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 32767", () => {
            record.a = 32767
            assert.strictEqual(record.a, 32767)
        })

        it("should be ok if it wrote -32768", () => {
            record.a = -32768
            assert.strictEqual(record.a, -32768)
        })

        it("should throw if it wrote 32768 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 32768
                }),
                "AssertionError: 'a' should be within '-32768..32767', but got 32768.",
            )
        })

        it("should throw if it wrote -129 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -32769
                }),
                "AssertionError: 'a' should be within '-32768..32767', but got -32769.",
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
                    TestRecord.view(buffer, 4)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (4 + 2 = 6), but got 5.",
            )
        })
    })

    describe("ObjectRecord with 2 'int16' fields", () => {
        const TestRecord = defineObjectRecord("Int16_2", {
            a: "int16",
            b: "int16",
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
            assert.strictEqual(record.a, 258)
            assert.strictEqual(record.b, 772)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st..4th bytes", () => {
            record.a = -30875
            record.b = 17185
            assert.strictEqual(record.a, -30875)
            assert.strictEqual(record.b, 17185)
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
                assert.strictEqual(record.a, 515)
                assert.strictEqual(record.b, 1029)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 2nd..5th bytes", () => {
                record.a = -30875
                record.b = 17185
                assert.strictEqual(record.a, -30875)
                assert.strictEqual(record.b, 17185)
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

        it("should have values [258,772]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [258, 772])
        })

        it("should have entries [[a,258], [b,772]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 258],
                ["b", 772],
            ])
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
