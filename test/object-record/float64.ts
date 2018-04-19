import assert from "assert"
import { ObjectRecord, RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'float64' field", () => {
        const TestRecord = defineObjectRecord("Float64_1", {
            a: "float64",
        })
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([
                0x00,
                0x01,
                0x02,
                0x03,
                0x04,
                0x05,
                0x06,
                0x07,
                0x08,
                0x09,
                0x0a,
                0x0b,
                0x0c,
                0x0d,
                0x0e,
                0x0f,
            ])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..8th bytes", () => {
            assert.strictEqual(record.a, 1.40159977307889e-309)
            assert.strictEqual(buffer[0], 0x00)
            assert.strictEqual(buffer[1], 0x01)
            assert.strictEqual(buffer[2], 0x02)
            assert.strictEqual(buffer[3], 0x03)
            assert.strictEqual(buffer[4], 0x04)
            assert.strictEqual(buffer[5], 0x05)
            assert.strictEqual(buffer[6], 0x06)
            assert.strictEqual(buffer[7], 0x07)
            assert.strictEqual(buffer[8], 0x08)
            assert.strictEqual(buffer[9], 0x09)
            assert.strictEqual(buffer[10], 0x0a)
            assert.strictEqual(buffer[11], 0x0b)
            assert.strictEqual(buffer[12], 0x0c)
            assert.strictEqual(buffer[13], 0x0d)
            assert.strictEqual(buffer[14], 0x0e)
            assert.strictEqual(buffer[15], 0x0f)
        })

        it("should write the 1st..8th bytes", () => {
            record.a = -1.2313300687736946e303
            assert.strictEqual(record.a, -1.2313300687736946e303)
            assert.strictEqual(buffer[0], 0xfe)
            assert.strictEqual(buffer[1], 0xdc)
            assert.strictEqual(buffer[2], 0xba)
            assert.strictEqual(buffer[3], 0x98)
            assert.strictEqual(buffer[4], 0x76)
            assert.strictEqual(buffer[5], 0x54)
            assert.strictEqual(buffer[6], 0x32)
            assert.strictEqual(buffer[7], 0x10)
            assert.strictEqual(buffer[8], 0x08)
            assert.strictEqual(buffer[9], 0x09)
            assert.strictEqual(buffer[10], 0x0a)
            assert.strictEqual(buffer[11], 0x0b)
            assert.strictEqual(buffer[12], 0x0c)
            assert.strictEqual(buffer[13], 0x0d)
            assert.strictEqual(buffer[14], 0x0e)
            assert.strictEqual(buffer[15], 0x0f)
        })

        describe("with offset 8", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 8)
            })

            it("should read the 9th..16th bytes", () => {
                assert.strictEqual(record.a, 5.924543410270741e-270)
                assert.strictEqual(buffer[0], 0x00)
                assert.strictEqual(buffer[1], 0x01)
                assert.strictEqual(buffer[2], 0x02)
                assert.strictEqual(buffer[3], 0x03)
                assert.strictEqual(buffer[4], 0x04)
                assert.strictEqual(buffer[5], 0x05)
                assert.strictEqual(buffer[6], 0x06)
                assert.strictEqual(buffer[7], 0x07)
                assert.strictEqual(buffer[8], 0x08)
                assert.strictEqual(buffer[9], 0x09)
                assert.strictEqual(buffer[10], 0x0a)
                assert.strictEqual(buffer[11], 0x0b)
                assert.strictEqual(buffer[12], 0x0c)
                assert.strictEqual(buffer[13], 0x0d)
                assert.strictEqual(buffer[14], 0x0e)
                assert.strictEqual(buffer[15], 0x0f)
            })

            it("should write the 9th..16th bytes", () => {
                record.a = -1.2313300687736946e303
                assert.strictEqual(record.a, -1.2313300687736946e303)
                assert.strictEqual(buffer[0], 0x00)
                assert.strictEqual(buffer[1], 0x01)
                assert.strictEqual(buffer[2], 0x02)
                assert.strictEqual(buffer[3], 0x03)
                assert.strictEqual(buffer[4], 0x04)
                assert.strictEqual(buffer[5], 0x05)
                assert.strictEqual(buffer[6], 0x06)
                assert.strictEqual(buffer[7], 0x07)
                assert.strictEqual(buffer[8], 0xfe)
                assert.strictEqual(buffer[9], 0xdc)
                assert.strictEqual(buffer[10], 0xba)
                assert.strictEqual(buffer[11], 0x98)
                assert.strictEqual(buffer[12], 0x76)
                assert.strictEqual(buffer[13], 0x54)
                assert.strictEqual(buffer[14], 0x32)
                assert.strictEqual(buffer[15], 0x10)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 64", () => {
            assert.strictEqual(TestRecord.bitLength, 64)
        })

        it("should have byteLength 8", () => {
            assert.strictEqual(TestRecord.byteLength, 8)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [1.40159977307889e-309]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [
                1.40159977307889e-309,
            ])
        })

        it("should have entries [[a, 1.40159977307889e-309]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 1.40159977307889e-309],
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
                    TestRecord.view(buffer, 9)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (9 + 8 = 17), but got 16.",
            )
        })
    })
})
