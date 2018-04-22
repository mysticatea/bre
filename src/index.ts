import { defineArrayRecord } from "./array-record"
import { defineObjectRecord } from "./object-record"
import { getTextEncoder, setTextEncoder } from "./text-encoder-registry"
import {
    ArrayRecord,
    ArrayRecordConstructor,
    DataType,
    Record,
    RecordConstructor,
    ConstructorOf,
    ObjectRecord,
    ObjectRecordConstructor,
    RecordOf,
    TextEncoder,
} from "./types"
import { isRecord } from "./utils"

export {
    ArrayRecord,
    ArrayRecordConstructor,
    Record,
    RecordConstructor,
    ConstructorOf,
    DataType,
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
