export const sBuffer = Symbol("buffer")

export interface Record {
    [sBuffer]: DataView
}

export interface Accessor<T> {
    readonly name: string
    readonly bits: number

    defineGet(propertyName: string, bitOffset: number): (this: Record) => T
    defineSet(
        propertyName: string,
        bitOffset: number,
    ): ((this: Record, value: T) => void) | undefined
}
