export { TextEncoder } from "./text-encoders/text-encoder"

export interface RecordConstructor extends Function {
    bitLength: number
    byteLength: number
}

export interface Record {
    readonly constructor: RecordConstructor
    toString(): string
}

export interface ArrayRecordConstructor<T = any> extends RecordConstructor {
    view(
        data: ArrayBuffer | ArrayBufferView,
        byteOffset?: number,
    ): ArrayRecord<T>
}

export interface ArrayRecord<T> extends Record {
    readonly constructor: ArrayRecordConstructor<T>
    readonly length: number

    concat(...items: ConcatArray<T>[]): T[]
    concat(...items: (T | ConcatArray<T>)[]): T[]
    copyWithin(target: number, start: number, end?: number): this
    every(
        callbackfn: (value: T, index: number, array: T[]) => boolean,
        thisArg?: any,
    ): boolean
    fill(value: T, start?: number, end?: number): this
    filter<S extends T>(
        callbackfn: (value: T, index: number, array: T[]) => value is S,
        thisArg?: any,
    ): S[]
    filter(
        callbackfn: (value: T, index: number, array: T[]) => any,
        thisArg?: any,
    ): T[]
    find<S extends T>(
        predicate: (
            this: void,
            value: T,
            index: number,
            obj: T[],
        ) => value is S,
        thisArg?: any,
    ): S | undefined
    find(
        predicate: (value: T, index: number, obj: T[]) => boolean,
        thisArg?: any,
    ): T | undefined
    findIndex(
        predicate: (value: T, index: number, obj: T[]) => boolean,
        thisArg?: any,
    ): number
    forEach(
        callbackfn: (value: T, index: number, array: T[]) => void,
        thisArg?: any,
    ): void
    includes(searchElement: T, fromIndex?: number): boolean
    indexOf(searchElement: T, fromIndex?: number): number
    join(separator?: string): string
    lastIndexOf(searchElement: T, fromIndex?: number): number
    map<U>(
        callbackfn: (value: T, index: number, array: T[]) => U,
        thisArg?: any,
    ): U[]
    reduce(
        callbackfn: (
            previousValue: T,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => T,
    ): T
    reduce(
        callbackfn: (
            previousValue: T,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => T,
        initialValue: T,
    ): T
    reduce<U>(
        callbackfn: (
            previousValue: U,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => U,
        initialValue: U,
    ): U
    reduceRight(
        callbackfn: (
            previousValue: T,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => T,
    ): T
    reduceRight(
        callbackfn: (
            previousValue: T,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => T,
        initialValue: T,
    ): T
    reduceRight<U>(
        callbackfn: (
            previousValue: U,
            currentValue: T,
            currentIndex: number,
            array: T[],
        ) => U,
        initialValue: U,
    ): U
    reverse(): this
    slice(start?: number, end?: number): T[]
    some(
        callbackfn: (value: T, index: number, array: T[]) => boolean,
        thisArg?: any,
    ): boolean
    sort(compareFn?: (a: T, b: T) => number): this

    entries(): IterableIterator<[number, T]>
    keys(): IterableIterator<number>
    values(): IterableIterator<T>
    [Symbol.iterator](): IterableIterator<T>

    toJSON(): T[]

    [index: number]: T
}

export interface ObjectRecordConstructor<T = {}> extends RecordConstructor {
    view(
        data: ArrayBuffer | ArrayBufferView,
        byteOffset?: number,
    ): ObjectRecord<T> & T

    entries(record: T): Array<[string, any]>
    keys(record: T): Array<string>
    values(record: T): Array<any>
}

export interface ObjectRecord<T> extends Record {
    readonly constructor: ObjectRecordConstructor<T>

    toJSON(): {
        [P in Exclude<
            keyof this,
            "constructor" | "toJSON" | "toString"
        >]: this[P]
    }
}

export type RecordOf<T> = T extends
    | ArrayRecordConstructor<any>
    | ObjectRecordConstructor<any>
    ? ReturnType<T["view"]>
    : never

export type ConstructorOf<T> = T extends ArrayRecord<infer E>
    ? ArrayRecordConstructor<E>
    : T extends ObjectRecord<infer S> ? ObjectRecordConstructor<S> : never

export type NumericDataType =
    | "bit1"
    | "bit2"
    | "bit3"
    | "bit4"
    | "bit5"
    | "bit6"
    | "bit7"
    | "bit8"
    | "int8"
    | "int16"
    | "int32"
    | "uint8"
    | "uint16"
    | "uint32"
    | "float32"
    | "float64"
export type StringDataType = { encoding: string; byteLength: number }
export type DataType =
    | NumericDataType
    | StringDataType
    | ArrayRecordConstructor<any>
    | ObjectRecordConstructor<any>

export type PropertyTypeOf<T extends DataType> = T extends NumericDataType
    ? number
    : T extends StringDataType
        ? string
        : T extends ArrayRecordConstructor<any> | ObjectRecordConstructor<any>
            ? RecordOf<T>
            : never
