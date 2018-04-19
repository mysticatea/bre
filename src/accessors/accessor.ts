import { ConstructorOf } from "../types"

export interface Accessor<T> {
    readonly name: string
    readonly bits: number
    readonly subRecord: ConstructorOf<T>
    propertyCode(propertyName: number | string, bitOffset: number): string
}
