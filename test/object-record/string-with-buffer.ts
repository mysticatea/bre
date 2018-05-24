import assert from "assert"
import { RecordOf, defineObjectRecord, setTextEncoder } from "../../src/index"
import NodejsBufferTextEncoder from "../../src/text-encoders/buffer"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord with NodejsBufferTextEncoder:", () => {
    describe("ObjectRecord with 1 '{ encoding: \"utf8\", byteLength: 15 }' field", () => {
        setTextEncoder(NodejsBufferTextEncoder)
        const TestRecord = defineObjectRecord("String15", {
            a: { encoding: "utf8", byteLength: 15 },
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from("Hello World!    ")
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..15th bytes", () => {
            assert.strictEqual(record.a, "Hello World!   ")
            assert.strictEqual(buffer[0], 0x48)
            assert.strictEqual(buffer[1], 0x65)
            assert.strictEqual(buffer[2], 0x6c)
            assert.strictEqual(buffer[3], 0x6c)
            assert.strictEqual(buffer[4], 0x6f)
            assert.strictEqual(buffer[5], 0x20)
            assert.strictEqual(buffer[6], 0x57)
            assert.strictEqual(buffer[7], 0x6f)
            assert.strictEqual(buffer[8], 0x72)
            assert.strictEqual(buffer[9], 0x6c)
            assert.strictEqual(buffer[10], 0x64)
            assert.strictEqual(buffer[11], 0x21)
            assert.strictEqual(buffer[12], 0x20)
            assert.strictEqual(buffer[13], 0x20)
            assert.strictEqual(buffer[14], 0x20)
            assert.strictEqual(buffer[15], 0x20)
        })

        it("should write the 1st..15th bytes", () => {
            record.a = "This is a pen."
            assert.strictEqual(record.a, "This is a pen.")
            assert.strictEqual(buffer[0], 0x54)
            assert.strictEqual(buffer[1], 0x68)
            assert.strictEqual(buffer[2], 0x69)
            assert.strictEqual(buffer[3], 0x73)
            assert.strictEqual(buffer[4], 0x20)
            assert.strictEqual(buffer[5], 0x69)
            assert.strictEqual(buffer[6], 0x73)
            assert.strictEqual(buffer[7], 0x20)
            assert.strictEqual(buffer[8], 0x61)
            assert.strictEqual(buffer[9], 0x20)
            assert.strictEqual(buffer[10], 0x70)
            assert.strictEqual(buffer[11], 0x65)
            assert.strictEqual(buffer[12], 0x6e)
            assert.strictEqual(buffer[13], 0x2e)
            assert.strictEqual(buffer[14], 0x00)
            assert.strictEqual(buffer[15], 0x20)
        })

        describe("with offset 1", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 1)
            })

            it("should read the 2nd..16th bytes", () => {
                assert.strictEqual(record.a, "ello World!    ")
                assert.strictEqual(buffer[0], 0x48)
                assert.strictEqual(buffer[1], 0x65)
                assert.strictEqual(buffer[2], 0x6c)
                assert.strictEqual(buffer[3], 0x6c)
                assert.strictEqual(buffer[4], 0x6f)
                assert.strictEqual(buffer[5], 0x20)
                assert.strictEqual(buffer[6], 0x57)
                assert.strictEqual(buffer[7], 0x6f)
                assert.strictEqual(buffer[8], 0x72)
                assert.strictEqual(buffer[9], 0x6c)
                assert.strictEqual(buffer[10], 0x64)
                assert.strictEqual(buffer[11], 0x21)
                assert.strictEqual(buffer[12], 0x20)
                assert.strictEqual(buffer[13], 0x20)
                assert.strictEqual(buffer[14], 0x20)
                assert.strictEqual(buffer[15], 0x20)
            })

            it("should write the 2nd..16th bytes", () => {
                record.a = "This is a pen."
                assert.strictEqual(record.a, "This is a pen.")
                assert.strictEqual(buffer[0], 0x48)
                assert.strictEqual(buffer[1], 0x54)
                assert.strictEqual(buffer[2], 0x68)
                assert.strictEqual(buffer[3], 0x69)
                assert.strictEqual(buffer[4], 0x73)
                assert.strictEqual(buffer[5], 0x20)
                assert.strictEqual(buffer[6], 0x69)
                assert.strictEqual(buffer[7], 0x73)
                assert.strictEqual(buffer[8], 0x20)
                assert.strictEqual(buffer[9], 0x61)
                assert.strictEqual(buffer[10], 0x20)
                assert.strictEqual(buffer[11], 0x70)
                assert.strictEqual(buffer[12], 0x65)
                assert.strictEqual(buffer[13], 0x6e)
                assert.strictEqual(buffer[14], 0x2e)
                assert.strictEqual(buffer[15], 0x00)
            })
        })

        //
        // Internationalization
        //

        it("should be possible to address Japanese", () => {
            record.a = "こんにちは"
            assert.strictEqual(record.a, "こんにちは")
            assert.strictEqual(buffer[0], 0xe3)
            assert.strictEqual(buffer[1], 0x81)
            assert.strictEqual(buffer[2], 0x93)
            assert.strictEqual(buffer[3], 0xe3)
            assert.strictEqual(buffer[4], 0x82)
            assert.strictEqual(buffer[5], 0x93)
            assert.strictEqual(buffer[6], 0xe3)
            assert.strictEqual(buffer[7], 0x81)
            assert.strictEqual(buffer[8], 0xab)
            assert.strictEqual(buffer[9], 0xe3)
            assert.strictEqual(buffer[10], 0x81)
            assert.strictEqual(buffer[11], 0xa1)
            assert.strictEqual(buffer[12], 0xe3)
            assert.strictEqual(buffer[13], 0x81)
            assert.strictEqual(buffer[14], 0xaf)
            assert.strictEqual(buffer[15], 0x20)
        })

        //
        // Meta Informations
        //

        it("should have bitLength 120", () => {
            assert.strictEqual(TestRecord.bitLength, 120)
        })

        it("should have byteLength 15", () => {
            assert.strictEqual(TestRecord.byteLength, 15)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it('should have values ["Hello World!   "]', () => {
            assert.deepStrictEqual(TestRecord.values(record), [
                "Hello World!   ",
            ])
        })

        it('should have entries [[a, "Hello World!   "]]', () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", "Hello World!   "],
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
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (2 + 15 = 17), but got 16.",
            )
        })
    })
})
