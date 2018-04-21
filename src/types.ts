export interface RecordConstructor {
    uid: string
    name: string
    bitLength: number
    byteLength: number
}

export interface Record {
    readonly constructor: RecordConstructor

    toJSON(): any
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

    toJSON(): any

    [index: number]: T
}

export interface ObjectRecordConstructor<T extends ObjectRecord = ObjectRecord>
    extends RecordConstructor {
    view(data: ArrayBuffer | ArrayBufferView, byteOffset?: number): T

    entries(record: T): Array<[string, any]>
    keys(record: T): Array<string>
    values(record: T): Array<any>
}

export interface ObjectRecord extends Record {
    readonly constructor: ObjectRecordConstructor

    toJSON(): any
}

export type RecordOf<T> = T extends ArrayRecordConstructor<infer E>
    ? ArrayRecord<E>
    : T extends ObjectRecordConstructor<infer R> ? R : never

export type ConstructorOf<T> = T extends ArrayRecord<infer E>
    ? ArrayRecordConstructor<E>
    : T extends ObjectRecord ? ObjectRecordConstructor<T> : never
