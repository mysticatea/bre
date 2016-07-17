/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("assert")
const Buffer = require("safe-buffer").Buffer
const bre = require("../../")
const BinaryRecord = bre.BinaryRecord
const defineObjectRecord = bre.defineObjectRecord
const setTextEncoder = bre.setTextEncoder
const thrownMessage = require("../lib/util").thrownMessage

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("defineObjectRecord misusecases:", () => {
    it("should throw an error if it instantiates BinaryRecord directly", () => {
        assert(thrownMessage(() => {
            //eslint-disable-next-line no-new
            new BinaryRecord(Buffer.from([0, 1, 2, 3]))
        }) === "'BinaryRecord' class cannot be directly instantiated. Use via 'bre.defineObjectRecord' or 'bre.defineArrayRecord'.")
    })

    it("should throw an error if it defines a string field with no text encoder", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("Record", [{type: "string(4)", name: "a"}])
        }) === "'bre.setTextEncoder()' is required before a use of string type.")
    })

    it("should throw an error if it defines a record with unknown type", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("Record", [{type: "unknown", name: "a"}])
        }) === "invalid type: unknown")
    })

    it("should throw an error if it defines a record with invalid name", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("invalid name", [{type: "int8", name: "a"}])
        }) === "'className' should be a PascalCase Identifier, but got \"invalid name\".")
    })

    it("should throw an error if it defines a field with invalid name", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("Record", [{type: "int8", name: "invalid name"}])
        }) === "'fields[0].name' should be a camelCase identifier, but got \"invalid name\".")
    })

    it("should throw an error if it defines __proto__ field", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("Record", [{type: "int8", name: "__proto__"}])
        }) === "'fields[0].name' should be a valid name, but got an forbidden name __proto__.")
    })

    it("should throw an error if it defines fields with a duplicate name", () => {
        setTextEncoder(null)
        assert(thrownMessage(() => {
            defineObjectRecord("Record", [{type: "int8", name: "a"}, {type: "int8", name: "a"}])
        }) === "'fields[1].name' should not be duplicate of other field names, but got duplicate name a.")
    })
})
