import assert from "assert"
import { ObjectRecord, RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    describe("ObjectRecord with 1 'bit1' field", () => {
        const TestRecord = defineObjectRecord("Bit1_1", { a: "bit1" })
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
            assert.strictEqual(record.a, 0)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            assert.strictEqual(record.a, 1)
            assert.strictEqual(buffer[0], 0x81)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 4", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 4)
            })

            it("should read the 5th byte", () => {
                assert.strictEqual(record.a, 0)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                assert.strictEqual(record.a, 1)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x85)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 1", () => {
            assert.strictEqual(TestRecord.bitLength, 1)
        })

        it("should have byteLength 1", () => {
            assert.strictEqual(TestRecord.byteLength, 1)
        })

        it("should have keys [a]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a"])
        })

        it("should have values [0]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [0])
        })

        it("should have entries [[a,0]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [["a", 0]])
        })

        //
        // Boundary Check
        //

        it("should be ok if it wrote 1", () => {
            record.a = 1
            assert.strictEqual(record.a, 1)
        })

        it("should be ok if it wrote 0", () => {
            record.a = 0
            assert.strictEqual(record.a, 0)
        })

        it("should throw if it wrote 2 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = 2
                }),
                "AssertionError: 'a' should be within '0..1', but got 2.",
            )
        })

        it("should throw if it wrote -1 (out of range)", () => {
            assert.strictEqual(
                thrownMessage(() => {
                    record.a = -1
                }),
                "AssertionError: 'a' should be within '0..1', but got -1.",
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
                    TestRecord.view(buffer, 5)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.",
            )
        })
    })

    describe("ObjectRecord with 2 'bit1' fields", () => {
        const TestRecord = defineObjectRecord("Bit1_2", {
            a: "bit1",
            b: "bit1",
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
            assert.strictEqual(record.a, 0)
            assert.strictEqual(record.b, 0)
            assert.strictEqual(buffer[0], 0x01)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        it("should write the 1st byte", () => {
            record.a = 1
            record.b = 1
            assert.strictEqual(record.a, 1)
            assert.strictEqual(record.b, 1)
            assert.strictEqual(buffer[0], 0xc1)
            assert.strictEqual(buffer[1], 0x02)
            assert.strictEqual(buffer[2], 0x03)
            assert.strictEqual(buffer[3], 0x04)
            assert.strictEqual(buffer[4], 0x05)
        })

        describe("with offset 4", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 4)
            })

            it("should read the 5th byte", () => {
                assert.strictEqual(record.a, 0)
                assert.strictEqual(record.b, 0)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0x05)
            })

            it("should write the 5th byte", () => {
                record.a = 1
                record.b = 1
                assert.strictEqual(record.a, 1)
                assert.strictEqual(record.b, 1)
                assert.strictEqual(buffer[0], 0x01)
                assert.strictEqual(buffer[1], 0x02)
                assert.strictEqual(buffer[2], 0x03)
                assert.strictEqual(buffer[3], 0x04)
                assert.strictEqual(buffer[4], 0xc5)
            })
        })

        //
        // Meta Informations
        //

        it("should have bitLength 2", () => {
            assert.strictEqual(TestRecord.bitLength, 2)
        })

        it("should have byteLength 1", () => {
            assert.strictEqual(TestRecord.byteLength, 1)
        })

        it("should have keys [a,b]", () => {
            assert.deepStrictEqual(TestRecord.keys(record), ["a", "b"])
        })

        it("should have values [0,0]", () => {
            assert.deepStrictEqual(TestRecord.values(record), [0, 0])
        })

        it("should have entries [[a,0], [b,0]]", () => {
            assert.deepStrictEqual(TestRecord.entries(record), [
                ["a", 0],
                ["b", 0],
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
                    TestRecord.view(buffer, 5)
                }),
                "AssertionError: 'buffer' should have enough size for the offset and size of this record (5 + 1 = 6), but got 5.",
            )
        })
    })

    describe("ObjectRecord with 16 'bit1' fields", () => {
        const TestRecord = defineObjectRecord("Bit1_16", {
            a: "bit1",
            b: "bit1",
            c: "bit1",
            d: "bit1",
            e: "bit1",
            f: "bit1",
            g: "bit1",
            h: "bit1",
            i: "bit1",
            j: "bit1",
            k: "bit1",
            l: "bit1",
            m: "bit1",
            n: "bit1",
            o: "bit1",
            p: "bit1",
        })
        const patterns: Array<[string, number]> = [
            ["a", 0x8000],
            ["b", 0x4000],
            ["c", 0x2000],
            ["d", 0x1000],
            ["e", 0x0800],
            ["f", 0x0400],
            ["g", 0x0200],
            ["h", 0x0100],
            ["i", 0x0080],
            ["j", 0x0040],
            ["k", 0x0020],
            ["l", 0x0010],
            ["m", 0x0008],
            ["n", 0x0004],
            ["o", 0x0002],
            ["p", 0x0001],
        ]
        let buffer: Buffer
        let record: RecordOf<typeof TestRecord>

        beforeEach(() => {
            buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
            record = TestRecord.view(buffer)
        })

        //
        // Basic
        //

        it("should read the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(pattern[1], 0)

                for (const key of TestRecord.keys(record)) {
                    assert.strictEqual(record[key], key === pattern[0] ? 1 : 0)
                }
            }
        })

        it("should write the 1st..2nd bytes", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0x0000, 0)
                record[pattern[0]] = 1
                assert.strictEqual(buffer.readUInt16BE(0), pattern[1])
            }
        })

        it("should write the 1st..2nd bytes (invert)", () => {
            for (const pattern of patterns) {
                buffer.writeUInt16BE(0xffff, 0)
                record[pattern[0]] = 0
                assert.strictEqual(buffer.readUInt16BE(0), ~pattern[1] & 0xffff)
            }
        })

        describe("with offset 3", () => {
            //eslint-disable-next-line no-shadow
            let record: RecordOf<typeof TestRecord>

            beforeEach(() => {
                record = TestRecord.view(buffer, 3)
            })

            it("should read the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(pattern[1], 3)

                    for (const key of TestRecord.keys(record)) {
                        assert.strictEqual(
                            record[key],
                            key === pattern[0] ? 1 : 0,
                        )
                    }
                }
            })

            it("should write the 4th..5th bytes", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0x0000, 3)
                    record[pattern[0]] = 1
                    assert.strictEqual(buffer.readUInt16BE(3), pattern[1])
                }
            })

            it("should write the 4th..5th bytes (invert)", () => {
                for (const pattern of patterns) {
                    buffer.writeUInt16BE(0xffff, 3)
                    record[pattern[0]] = 0
                    assert.strictEqual(
                        buffer.readUInt16BE(3),
                        ~pattern[1] & 0xffff,
                    )
                }
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

        it("should have keys [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p]", () => {
            assert.deepStrictEqual(
                TestRecord.keys(record),
                "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p".split(","),
            )
        })
    })
})
