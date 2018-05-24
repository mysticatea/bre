# bre

[![npm version](https://img.shields.io/npm/v/bre.svg)](https://www.npmjs.com/package/bre)
[![Downloads/month](https://img.shields.io/npm/dm/bre.svg)](http://www.npmtrends.com/bre)
[![Build Status](https://travis-ci.org/mysticatea/bre.svg?branch=master)](https://travis-ci.org/mysticatea/bre)
[![codecov](https://codecov.io/gh/mysticatea/bre/branch/master/graph/badge.svg)](https://codecov.io/gh/mysticatea/bre)
[![Dependency Status](https://david-dm.org/mysticatea/bre.svg)](https://david-dm.org/mysticatea/bre)

A Object-Binary Mapper for JavaScript/TypeScript.

This is similar to C `struct` with a memory block.

```ts
import { defineObjectRecord } from "bre"

// Define a Record Type.
const TcpHeader = defineObjectRecord("TcpHeader", {
    srcPort: "uint16",
    dstPort: "uint16",
    seqNo: "uint32",
    ackNo: "uint32",
    dataOffset: "bit4",
    _reserved0: "bit6", // padding
    urgCode: "bit1",
    ackCode: "bit1",
    pshCode: "bit1",
    rstCode: "bit1",
    synCode: "bit1",
    finCode: "bit1",
    windowSize: "uint16",
    checksum: "uint16",
    urgentPonter: "uint16",
})

// Connect to a Buffer (E.g., a buffer came from stream...)
const header = TcpHeader.view(a_buffer, 0)

// Read and Write the Buffer
console.log(header.srcPort, "→", header.dstPort, "🚀")
header.seqNo += 1
header.ackNo += 1
header.ackCode = 1
```

`bre`'s record object is just a wrapper of [ArrayBuffer] objects.

- The read of properties reads the connected buffer directly.
- The write of properties writes the connected buffer directly.

So the above `TcpHeader` example defines the class like the following automatically: <details><summary>Open the defined class</summary>

```js
class TcpHeader extends ObjectRecord {
    constructor(buffer, byteOffset) {
        super(buffer, byteOffset, 20)
    }

    static view(buffer, byteOffset = 0) {
        return Object.freeze(new TcpHeader(buffer, byteOffset))
    }

    static get bitLength() {
        return 160
    }

    static get byteLength() {
        return 20
    }

    static keys(record) {
        return [
            "srcPort",
            "dstPort",
            "seqNo",
            "ackNo",
            "dataOffset",
            "urgCode",
            "ackCode",
            "pshCode",
            "rstCode",
            "synCode",
            "finCode",
            "windowSize",
            "checksum",
            "urgentPonter",
        ]
    }

    static values(record) {
        return [
            record.srcPort,
            record.dstPort,
            record.seqNo,
            record.ackNo,
            record.dataOffset,
            record.urgCode,
            record.ackCode,
            record.pshCode,
            record.rstCode,
            record.synCode,
            record.finCode,
            record.windowSize,
            record.checksum,
            record.urgentPonter,
        ]
    }

    static entries(record) {
        return [
            ["srcPort", record.srcPort],
            ["dstPort", record.dstPort],
            ["seqNo", record.seqNo],
            ["ackNo", record.ackNo],
            ["dataOffset", record.dataOffset],
            ["urgCode", record.urgCode],
            ["ackCode", record.ackCode],
            ["pshCode", record.pshCode],
            ["rstCode", record.rstCode],
            ["synCode", record.synCode],
            ["finCode", record.finCode],
            ["windowSize", record.windowSize],
            ["checksum", record.checksum],
            ["urgentPonter", record.urgentPonter],
        ]
    }

    get srcPort() {
        return this[sBuffer].getUint16(0)
    }
    set srcPort(value) {
        assert.integer(value, "srcPort")
        assert.range(value, 0, 65535, "srcPort")
        this[sBuffer].setUint16(0, value)
    }
    get dstPort() {
        return this[sBuffer].getUint16(2)
    }
    set dstPort(value) {
        assert.integer(value, "dstPort")
        assert.range(value, 0, 65535, "dstPort")
        this[sBuffer].setUint16(2, value)
    }
    get seqNo() {
        return this[sBuffer].getUint32(4)
    }
    set seqNo(value) {
        assert.integer(value, "seqNo")
        assert.range(value, 0, 4294967295, "seqNo")
        this[sBuffer].setUint32(4, value)
    }
    get ackNo() {
        return this[sBuffer].getUint32(8)
    }
    set ackNo(value) {
        assert.integer(value, "ackNo")
        assert.range(value, 0, 4294967295, "ackNo")
        this[sBuffer].setUint32(8, value)
    }
    get dataOffset() {
        const data = this[sBuffer].getUint8(12)
        return (data & 240) >> 4
    }
    set dataOffset(value) {
        assert.integer(value, "dataOffset")
        assert.range(value, 0, 15, "dataOffset")

        const data = this[sBuffer].getUint8(12)
        this[sBuffer].setUint8(12, ((value << 4) & 240) | (data & ~240))
    }
    get urgCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 32) >> 5
    }
    set urgCode(value) {
        assert.integer(value, "urgCode")
        assert.range(value, 0, 1, "urgCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 5) & 32) | (data & ~32))
    }
    get ackCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 16) >> 4
    }
    set ackCode(value) {
        assert.integer(value, "ackCode")
        assert.range(value, 0, 1, "ackCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 4) & 16) | (data & ~16))
    }
    get pshCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 8) >> 3
    }
    set pshCode(value) {
        assert.integer(value, "pshCode")
        assert.range(value, 0, 1, "pshCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 3) & 8) | (data & ~8))
    }
    get rstCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 4) >> 2
    }
    set rstCode(value) {
        assert.integer(value, "rstCode")
        assert.range(value, 0, 1, "rstCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 2) & 4) | (data & ~4))
    }
    get synCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 2) >> 1
    }
    set synCode(value) {
        assert.integer(value, "synCode")
        assert.range(value, 0, 1, "synCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 1) & 2) | (data & ~2))
    }
    get finCode() {
        const data = this[sBuffer].getUint8(13)
        return (data & 1) >> 0
    }
    set finCode(value) {
        assert.integer(value, "finCode")
        assert.range(value, 0, 1, "finCode")

        const data = this[sBuffer].getUint8(13)
        this[sBuffer].setUint8(13, ((value << 0) & 1) | (data & ~1))
    }
    get windowSize() {
        return this[sBuffer].getUint16(14)
    }
    set windowSize(value) {
        assert.integer(value, "windowSize")
        assert.range(value, 0, 65535, "windowSize")
        this[sBuffer].setUint16(14, value)
    }
    get checksum() {
        return this[sBuffer].getUint16(16)
    }
    set checksum(value) {
        assert.integer(value, "checksum")
        assert.range(value, 0, 65535, "checksum")
        this[sBuffer].setUint16(16, value)
    }
    get urgentPonter() {
        return this[sBuffer].getUint16(18)
    }
    set urgentPonter(value) {
        assert.integer(value, "urgentPonter")
        assert.range(value, 0, 65535, "urgentPonter")
        this[sBuffer].setUint16(18, value)
    }
}
```

</details><br>

Plus, this package provides the perfect type definition for the classes that `defineObjectRecord`/`defineArrayRecord` defined.

[ArrayBuffer]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer

## 💿 Installation

```bash
$ npm install --save bre
```

- Requires Node.js `>=6.0.0`

## 📖 Usage

TBD.

## 📰 Changelog

- https://github.com/mysticatea/bre/releases

## ❤️ Contributing

Thank you for contributing!

Use Issues/PRs on GitHub.

### Development tools

- `npm test` ... Runs all tests.
- `npm run build` ... Compiles JavaScript code from TypeScript source code.
- `npm run clean` ... Removes compiled files, temporary files, and coverage data.
- `npm run coverage` ... Opens the code coverage of the last `npm test`.
- `npm run lint` ... Applies ESLint to the source code.
- `npm run watch` ... Runs all tests on every file changes.
