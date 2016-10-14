# bre

[![npm version](https://img.shields.io/npm/v/bre.svg)](https://www.npmjs.com/package/bre)
[![Downloads/month](https://img.shields.io/npm/dm/bre.svg)](http://www.npmtrends.com/bre)
[![Build Status](https://travis-ci.org/mysticatea/bre.svg?branch=master)](https://travis-ci.org/mysticatea/bre)
[![codecov](https://codecov.io/gh/mysticatea/bre/branch/master/graph/badge.svg)](https://codecov.io/gh/mysticatea/bre)
[![Dependency Status](https://david-dm.org/mysticatea/bre.svg)](https://david-dm.org/mysticatea/bre)

A Binary-Object Mapper for JavaScript.

```js
const bre = require("bre")

// Define a Record Type.
const TcpHeader = bre.defineObjectRecord("TcpHeader", [
    {type: "uint16", name: "srcPort"},
    {type: "uint16", name: "dstPort"},
    {type: "uint32", name: "seqNo"},
    {type: "uint32", name: "ackNo"},
    {type: "bit4", name: "dataOffset"},
    {skip: 6},
    {type: "bit1", name: "urgCode"},
    {type: "bit1", name: "ackCode"},
    {type: "bit1", name: "pshCode"},
    {type: "bit1", name: "rstCode"},
    {type: "bit1", name: "synCode"},
    {type: "bit1", name: "finCode"},
    {type: "uint16", name: "windowSize"},
    {type: "uint16", name: "checksum"},
    {type: "uint16", name: "urgentPonter"},
])

// Connect to a Buffer
const header = TcpHeader.view(a_buffer, 0)

// Read and Write the Buffer
console.log(header.srcPort, "→", header.dstPort, "🚀")
header.seqNo += 1
header.ackNo += 1
header.ackCode = 1
```

`bre`'s record object is just the wrapper of an [ArrayBuffer] object.

- The read of a record object's property is the read of the wrapped buffer.
- The write of a record object's property is the write of the wrapped buffer.

[ArrayBuffer]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

## :cd: Installation

```bash
$ npm install --save bre
```

- Requires Node.js `>=4.0.0`

## :book: Usage

Like C `struct`, `bre` allows accessing binary data as a structure fastly.

The following steps are the basic usage of `bre`:

1. Defines structures (calls it records).
2. Creates mapping between the structure and a binary data.
3. Reads/Writes the binary data as the structure.

### 1. Defines structures (calls it records).

    const bre = require("bre")
    const ExampleRecord = bre.defineObjectRecord("ExampleRecord", [
        {type: "uint8", name: "a"},
        {type: "uint8", name: "b"},
    ])

At first, it defines classes of structures by
[bre.defineObjectRecord](https://mysticatea.github.io/bre/module-bre.html#.defineObjectRecord) or
[bre.defineArrayRecord](https://mysticatea.github.io/bre/module-bre.html#.defineArrayRecord).

The code above defines a class `ExampleRecord` which has 2 properties (`a`
and `b`).

### 2. Creates mapping between the structure and a binary data.

`ExampleRecord` can be instantiated with an [ArrayBuffer] object or a view of
an [ArrayBuffer] object. E.g., Node.js [Buffer] objects are the view of
[ArrayBuffer] objects.

    const buffer = Buffer.from([0x01, 0x02, 0x03])
    const record1 = ExampleRecord.view(buffer, 0)
    const record2 = ExampleRecord.view(buffer, 1)  // offset 1

`ExampleRecord.view` factory method creates an instance of `ExampleRecord`.

- The 1st argument is the buffer to access.
- The 2nd argument is the offset in bytes to access.

### 3. Reads/Writes the binary data as the structure.

    console.log(record1.a, record1.b)  // => 1 2
    console.log(record2.a, record2.b)  // => 2 3

    record1.b = 10

    console.log(record1.b)  // => 10
    console.log(record2.a)  // => 10
    console.log(buffer[1])  // => 10

Those record instances are just wrappers. The `record1.a` getter will read
the 1st byte of `buffer` directly. The `record2.a` getter will read the 2nd
byte of `buffer` directly.

Also, The `record1.a` setter will write the 1st byte of `buffer` directly.
This means that `record2.a` which is sharing the `buffer` will be changed.

This would be useful to read and write binary data.

### The size of records.

Record classes have 2 properties to get the record size.
Those are static getter properties (since records are fixed size).

    const bytes = ExampleRecord.byteLength
    const bits = ExampleRecord.bitLength

Also, `BinaryRecord` class provides 2 methods to get the record size of a
record instance.

    const bytes = bre.BinaryRecord.byteLength(record1)
    const bits = bre.BinaryRecord.bitLength(record1)

[ArrayBuffer]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
[Buffer]: https://nodejs.org/buffer.html#buffer_buffer


## :books: API Reference

```js
const bre = require("bre")
```

- [bre.defineObjectRecord(className, fields)](https://mysticatea.github.io/bre/module-bre.html#.defineObjectRecord)
- [bre.defineArrayRecord(type, length)](https://mysticatea.github.io/bre/module-bre.html#.defineArrayRecord)
- [bre.getTextEncoder()](https://mysticatea.github.io/bre/module-bre.html#.getTextEncoder)
- [bre.setTextEncoder(value)](https://mysticatea.github.io/bre/module-bre.html#.setTextEncoder)
- [bre.BinaryRecord](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#)
    - [bre.BinaryRecord.bitLength(record)](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#.bitLength)
    - [bre.BinaryRecord.byteLength(record)](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#.byteLength)
    - [bre.BinaryRecord.keys(record)](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#.keys)
    - [bre.BinaryRecord.values(record)](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#.values)
    - [bre.BinaryRecord.entries(record)](https://mysticatea.github.io/bre/module-bre.BinaryRecord.html#.entries)

## :newspaper: Changelog

- https://github.com/mysticatea/bre/releases

## :muscle: Contributing

Thank you for contributing!

- Getting code:

  ```bash
  $ git clone https://github.com/mysticatea/bre.git
  $ cd bre
  $ npm install
  ```

- Testing:

  ```bash
  $ npm run watch
  ```
