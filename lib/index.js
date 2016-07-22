/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
/**
 * Like C `struct`, `bre` allows accessing binary data as a structure fastly.
 *
 * The following steps are the basic usage of `bre`:
 *
 * 1. Defines structures (calls it records).
 * 2. Creates mapping between the structure and a binary data.
 * 3. Reads/Writes the binary data as the structure.
 *
 * ### 1. Defines structures (calls it records).
 *
 *     const bre = require("bre")
 *     const ExampleRecord = bre.defineObjectRecord("ExampleRecord", [
 *         {type: "uint8", name: "a"},
 *         {type: "uint8", name: "b"},
 *     ])
 *
 * At first, it defines classes of structures by
 * {@link module:bre.defineObjectRecord bre.defineObjectRecord} or
 * {@link module:bre.defineArrayRecord bre.defineArrayRecord}.
 *
 * The code above defines a class `ExampleRecord` which has 2 properties (`a`
 * and `b`).
 *
 * ### 2. Creates mapping between the structure and a binary data.
 *
 * `ExampleRecord` can be instantiated with an [ArrayBuffer] object or a view of
 * an [ArrayBuffer] object. E.g., Node.js [Buffer] objects are the view of
 * [ArrayBuffer] objects.
 *
 *     const buffer = Buffer.from([0x01, 0x02, 0x03])
 *     const record1 = ExampleRecord.view(buffer, 0)
 *     const record2 = ExampleRecord.view(buffer, 1)  // offset 1
 *
 * `ExampleRecord.view` factory method creates an instance of `ExampleRecord`.
 *
 * - The 1st argument is the buffer to access.
 * - The 2nd argument is the offset in bytes to access.
 *
 * ### 3. Reads/Writes the binary data as the structure.
 *
 *     console.log(record1.a, record1.b)  // => 1 2
 *     console.log(record2.a, record2.b)  // => 2 3
 *
 *     record1.b = 10
 *
 *     console.log(record1.b)  // => 10
 *     console.log(record2.a)  // => 10
 *     console.log(buffer[1])  // => 10
 *
 * Those record instances are just wrappers. The `record1.a` getter will read
 * the 1st byte of `buffer` directly. The `record2.a` getter will read the 2nd
 * byte of `buffer` directly.
 *
 * Also, The `record1.a` setter will write the 1st byte of `buffer` directly.
 * This means that `record2.a` which is sharing the `buffer` will be changed.
 *
 * This would be useful to read and write binary data.
 *
 * ### The size of records.
 *
 * Record classes have 2 properties to get the record size.
 * Those are static getter properties (since records are fixed size).
 *
 *     const bytes = ExampleRecord.byteLength
 *     const bits = ExampleRecord.bitLength
 *
 * Also, `BinaryRecord` class provides 2 methods to get the record size of a
 * record instance.
 *
 *     const bytes = bre.BinaryRecord.byteLength(record1)
 *     const bits = bre.BinaryRecord.bitLength(record1)
 *
 * [ArrayBuffer]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
 * [Buffer]: https://nodejs.org/api/buffer.html#buffer_buffer
 *
 * @module bre
 */
"use strict"

Object.assign(
    exports,
    require("./binary-record"),
    require("./binary-record-builder"),
    require("./text-encoder-registry")
)
