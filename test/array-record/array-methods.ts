import assert from "assert"
import { ArrayRecord, defineArrayRecord } from "../../src/index"

describe("defineArrayRecord:", () => {
    describe("ArrayRecord with 'bit3' and 4", () => {
        const TestRecord = defineArrayRecord("bit3", 4)
        let buffer: Buffer
        let record: ArrayRecord<number>

        beforeEach(() => {
            buffer = Buffer.alloc(2)
            record = TestRecord.view(buffer)
            record[0] = 1
            record[1] = 3
            record[2] = 5
            record[3] = 7
        })

        it("should have 'Array.prototype.concat()'", () => {
            assert.deepStrictEqual(record.concat([1, 2, 3]), [
                1,
                3,
                5,
                7,
                1,
                2,
                3,
            ])
        })

        it("should have 'Array.prototype.copyWithin()'", () => {
            record.copyWithin(0, 1, 3)
            assert.deepStrictEqual(Array.from(record), [3, 5, 5, 7])
        })

        it("should have 'Array.prototype.entries()'", () => {
            assert.deepStrictEqual(Array.from(record.entries()), [
                [0, 1],
                [1, 3],
                [2, 5],
                [3, 7],
            ])
        })

        it("should have 'Array.prototype.every()'", () => {
            assert.strictEqual(record.every(n => n % 2 === 1), true)
        })

        it("should have 'Array.prototype.fill()'", () => {
            record.fill(7, 1, 3)
            assert.deepStrictEqual(Array.from(record), [1, 7, 7, 7])
        })

        it("should have 'Array.prototype.filter()'", () => {
            assert.deepStrictEqual(record.filter(n => n >= 5), [5, 7])
        })

        it("should have 'Array.prototype.find()'", () => {
            assert.strictEqual(record.find(n => n >= 5), 5)
        })

        it("should have 'Array.prototype.findIndex()'", () => {
            assert.strictEqual(record.findIndex(n => n >= 5), 2)
        })

        it("should have 'Array.prototype.forEach()'", () => {
            const receiver = { _: 777 }
            const actual: any[] = []
            record.forEach(function(this: any, value, index, array) {
                actual.push([value, index, array, this])
            }, receiver)
            assert.deepStrictEqual(actual, [
                [1, 0, record, receiver],
                [3, 1, record, receiver],
                [5, 2, record, receiver],
                [7, 3, record, receiver],
            ])
        })

        it("should have 'Array.prototype.includes()'", () => {
            assert.strictEqual(record.includes(3), true)
            assert.strictEqual(record.includes(3, 2), false)
        })

        it("should have 'Array.prototype.indexOf()'", () => {
            assert.strictEqual(record.indexOf(3), 1)
            assert.strictEqual(record.indexOf(3, 2), -1)
        })

        it("should have 'Array.prototype.join()'", () => {
            assert.strictEqual(record.join("-"), "1-3-5-7")
        })

        it("should have 'Array.prototype.keys()'", () => {
            assert.deepStrictEqual(Array.from(record.keys()), [0, 1, 2, 3])
        })

        it("should have 'Array.prototype.lastIndexOf()'", () => {
            assert.strictEqual(record.lastIndexOf(5), 2)
            assert.strictEqual(record.lastIndexOf(5, 1), -1)
        })

        it("should have 'Array.prototype.map()'", () => {
            assert.deepStrictEqual(record.map((v, i) => i + v), [1, 4, 7, 10])
        })

        it("should have 'Array.prototype.reduce()'", () => {
            assert.strictEqual(record.reduce((s, v) => s + v, "#"), "#1357")
        })

        it("should have 'Array.prototype.reduceRight()'", () => {
            assert.strictEqual(
                record.reduceRight((s, v) => s + v, "#"),
                "#7531",
            )
        })

        it("should have 'Array.prototype.reverse()'", () => {
            record.reverse()
            assert.deepStrictEqual(Array.from(record), [7, 5, 3, 1])
        })

        it("should have 'Array.prototype.slice()'", () => {
            assert.deepStrictEqual(record.slice(), [1, 3, 5, 7])
            assert.deepStrictEqual(record.slice(1), [3, 5, 7])
            assert.deepStrictEqual(record.slice(1, 3), [3, 5])
        })

        it("should have 'Array.prototype.some()'", () => {
            assert.strictEqual(record.some(n => n === 3), true)
            assert.strictEqual(record.some(n => n === 4), false)
        })

        it("should have 'Array.prototype.sort()'", () => {
            record[1] = 6
            record.sort()
            assert.deepStrictEqual(Array.from(record), [1, 5, 6, 7])
            record.sort((a, b) => b - a)
            assert.deepStrictEqual(Array.from(record), [7, 6, 5, 1])
        })

        it("should have 'Array.prototype.values()'", () => {
            assert.deepStrictEqual(Array.from(record.values()), [1, 3, 5, 7])
        })
    })
})
