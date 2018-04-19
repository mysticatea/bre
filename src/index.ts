import { defineArrayRecord } from "./records/array-record"
import { DataTypeWithOffset, defineObjectRecord } from "./records/object-record"
import { TextEncoder } from "./text-encoders/text-encoder"
import { DataType } from "./accessor-registry"
import { getTextEncoder, setTextEncoder } from "./text-encoder-registry"
import {
    ArrayRecord,
    ArrayRecordConstructor,
    Record,
    RecordConstructor,
    ConstructorOf,
    ObjectRecord,
    ObjectRecordConstructor,
    RecordOf,
} from "./types"
import { isRecord } from "./utils"

export {
    ArrayRecord,
    ArrayRecordConstructor,
    Record,
    RecordConstructor,
    ConstructorOf,
    DataType,
    DataTypeWithOffset,
    ObjectRecord,
    ObjectRecordConstructor,
    RecordOf,
    TextEncoder,
    defineArrayRecord,
    defineObjectRecord,
    getTextEncoder,
    isRecord,
    setTextEncoder,
}
export default {
    defineArrayRecord,
    defineObjectRecord,
    getTextEncoder,
    isRecord,
    setTextEncoder,
}
