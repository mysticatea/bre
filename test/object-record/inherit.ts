import assert from "assert"
import { ObjectRecord, RecordOf, defineObjectRecord } from "../../src/index"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord:", () => {
    it("ObjectRecord can be inherited.", () => {
        const TestRecord = defineObjectRecord("TestRecord", {
            a: "uint8",
            b: "uint8",
        })

        class TestRecordEx extends TestRecord {
            static view(buffer: Buffer): TestRecordEx {
                return super.view(buffer) as TestRecordEx //eslint-disable-line mysticatea/no-this-in-static
            }
            get c() {
                return this.a + this.b
            }
        }

        const buffer = Buffer.from([0x01, 0x02])
        const record = TestRecordEx.view(buffer)

        assert.strictEqual(record.c, 3)
    })
})
