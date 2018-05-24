import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 0 length", () => {
        const TestRecord = defineArrayRecord("int32", 0)
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
            assert.strictEqual(record.length, 0)
        })

        it("should not have indexers", () => {
            assert.strictEqual(record[0], undefined)
        })

        it("should not be writable", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record[0] = 1
                }),
                thrownMessage(() => {
                    // This error message is different between Node.js 6.x and 8.x.
                    // https://github.com/eslint/typescript-eslint-parser/issues/467
                    //eslint-disable-next-line no-empty-pattern
                    Object.freeze({} as any)[0] = 1
                }),
            )
        })

        //
        // Meta Informations
        //

        it("should have bitLength 0", () => {
            assert.strictEqual(TestRecord.bitLength, 0)
        })

        it("should have byteLength 0", () => {
            assert.strictEqual(TestRecord.byteLength, 0)
        })

        it("should have keys []", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [])
        })

        it("should have values []", () => {
            assert.deepStrictEqual(Array.from(record.values()), [])
        })

        it("should have entries []", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [])
        })
    })
})
