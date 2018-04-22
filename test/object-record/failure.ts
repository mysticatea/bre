import assert from "assert"
import {
    ObjectRecord,
    RecordOf,
    defineObjectRecord,
    setTextEncoder,
} from "../../src/index"
import NodejsBufferTextEncoder from "../../src/text-encoders/buffer"
import { thrownMessage } from "../lib/util"

describe("defineObjectRecord misusecases:", () => {
    it("should throw an error if it defines a string field with no text encoder", () => {
        setTextEncoder(null)
        assert.strictEqual(
            thrownMessage(() => {
                defineObjectRecord("Record", {
                    a: { encoding: "utf8", byteLength: 4 },
                })
            }),
            "AssertionError: Requires 'bre.setTextEncoder()' prior to use of string type.",
        )
    })

    it("should throw an error if it defines a record with unknown type", () => {
        setTextEncoder(NodejsBufferTextEncoder)
        assert.strictEqual(
            thrownMessage(() => {
                defineObjectRecord("Record", {
                    a: { encoding: "utf256", byteLength: 4 },
                })
            }),
            "AssertionError: 'encoding' should be a valid encoding type, but got 'utf256'.",
        )
    })

    it("should throw an error if it defines a record with invalid name", () => {
        assert.strictEqual(
            thrownMessage(() => {
                defineObjectRecord("invalid name", { a: "int8" })
            }),
            "AssertionError: 'className' should be a PascalCase Identifier, but got \"invalid name\".",
        )
    })

    it("should throw an error if it defines toString field", () => {
        assert.strictEqual(
            thrownMessage(() => {
                defineObjectRecord("Record", { toString: "int8" } as any)
            }),
            "AssertionError: The name of 'shape.toString' property should NOT be a forbidden name \"toString\".",
        )
    })
})
