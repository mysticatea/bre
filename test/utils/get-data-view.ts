import assert from "assert"
import { defineObjectRecord, getDataView } from "../../src/index"

describe("getDataView", () => {
    it("should return DataView object.", () => {
        const TestRecord = defineObjectRecord("TestRecord", {
            a: "int8",
            b: "int8",
        })
        const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05])
        const record = TestRecord.view(buffer, 1)
        const dv = getDataView(record)

        assert.strictEqual(dv.byteLength, 2)
        assert.strictEqual(dv.getInt8(0), 2)
        assert.strictEqual(dv.getInt8(1), 3)
    })
})
